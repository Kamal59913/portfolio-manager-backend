import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { FileUploadOptions } from '../interfaces/fileUploadOptions.interface';

// Helper method to create Multer options for multiple fields
export function createMulterOptions(fields: FileUploadOptions[], baseUploadPath: string): MulterOptions {
  const logger = new Logger('FileUploadInterceptor');

  // Validate field configurations
  fields.forEach(field => {
    if (!field.fieldName.trim()) {
      throw new HttpException('Field name cannot be empty', HttpStatus.BAD_REQUEST);
    }
    if (!field.allowedExtensions.length) {
      throw new HttpException(`No allowed extensions specified for ${field.fieldName}`, HttpStatus.BAD_REQUEST);
    }
    if (field.maxSize.value <= 0) {
      throw new HttpException(`Max size for ${field.fieldName} must be positive`, HttpStatus.BAD_REQUEST);
    }
    if (!['KB', 'MB'].includes(field.maxSize.unit)) {
      throw new HttpException(`Invalid unit for ${field.fieldName}. Use 'KB' or 'MB'`, HttpStatus.BAD_REQUEST);
    }
  });

  // Calculate max file size in bytes
  const maxSizeBytes = Math.max(
    ...fields.map(f => f.maxSize.value * (f.maxSize.unit === 'MB' ? 1024 * 1024 : 1024)),
  );

  // Find the field with the largest size for error messaging
  const largestSizeField = fields.reduce((prev, curr) => {
    const prevBytes = prev.maxSize.value * (prev.maxSize.unit === 'MB' ? 1024 * 1024 : 1024);
    const currBytes = curr.maxSize.value * (curr.maxSize.unit === 'MB' ? 1024 * 1024 : 1024);
    return currBytes >= prevBytes ? curr : prev;
  });

  return {
    storage: diskStorage({
      destination: async (req, file, cb) => {
        try {
          const fieldOptions = fields.find(f => f.fieldName === file.fieldname);
          if (!fieldOptions) {
            return cb(new HttpException('Invalid field name', HttpStatus.BAD_REQUEST), false);
          }

          const subfolder = fieldOptions.destination || 'uploads';
          const destination = path.join(baseUploadPath, subfolder);

          await fs.mkdir(destination, { recursive: true });
          cb(null, destination);
        } catch (error) {
          logger.error(`Failed to create upload directory: ${error.message}`);
          cb(new HttpException('Failed to create upload directory', HttpStatus.INTERNAL_SERVER_ERROR), false);
        }
      },
      filename: (req, file, cb) => {
        const timestamp = Date.now();
        const uuid = crypto.randomUUID();
        const extension = path.extname(file.originalname).toLowerCase();
        const uniqueFilename = `${timestamp}-${uuid}${extension}`;
        cb(null, uniqueFilename);
      },
    }),
    fileFilter: (req, file, cb) => {
      const fieldOptions = fields.find(f => f.fieldName === file.fieldname);
      if (!fieldOptions) {
        return cb(new HttpException('Invalid field name', HttpStatus.BAD_REQUEST), false);
      }

      const extension = path.extname(file.originalname).toLowerCase().replace('.', '');
      const isValidExtension = fieldOptions.allowedExtensions.includes(extension);

      // Validate MIME type for additional security
      const mimeTypes: Record<string, string> = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        pdf: 'application/pdf',
        doc: 'application/msword',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      };
      const expectedMime = mimeTypes[extension];
      const isValidMime = !expectedMime || file.mimetype === expectedMime;

      if (!isValidExtension) {
        return cb(
          new HttpException(
            `Invalid file extension for ${fieldOptions.fieldName}. Allowed: ${fieldOptions.allowedExtensions.join(', ')}`,
            HttpStatus.BAD_REQUEST,
          ),
          false,
        );
      }
      if (!isValidMime) {
        return cb(
          new HttpException(
            `Invalid file type for ${fieldOptions.fieldName}. File does not match expected type`,
            HttpStatus.BAD_REQUEST,
          ),
          false,
        );
      }

      cb(null, true);
    },
    limits: {
      fileSize: maxSizeBytes,
    },
  };
}

// Multi-field interceptor for handling multiple fields with different configurations
@Injectable()
export class MultiFieldFileInterceptor implements NestInterceptor {
  private readonly logger = new Logger(MultiFieldFileInterceptor.name);
  private readonly baseUploadPath: string;

  constructor(
    private readonly fields: FileUploadOptions[],
  ) {
    this.baseUploadPath = 'public/uploads';
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    // Find the field with the largest size for error messaging
    const largestSizeField = this.fields.reduce((prev, curr) => {
      const prevBytes = prev.maxSize.value * (prev.maxSize.unit === 'MB' ? 1024 * 1024 : 1024);
      const currBytes = curr.maxSize.value * (curr.maxSize.unit === 'MB' ? 1024 * 1024 : 1024);
      return currBytes >= prevBytes ? curr : prev;
    });

    const multerOptions = createMulterOptions(this.fields, this.baseUploadPath);
    const multerFields = this.fields.map(field => ({
      name: field.fieldName,
      maxCount: field.maxCount,
    }));
    const multerMiddleware = require('multer')(multerOptions).fields(multerFields);

    return new Observable(observer => {
      multerMiddleware(request, null, (err: any) => {
        if (err) {
          this.logger.error(`File upload error: ${err.message}`);
          if (err instanceof HttpException) {
            throw err;
          }
          if (err.code === 'LIMIT_FILE_SIZE') {
            throw new HttpException(
              `File too large. Max size is ${largestSizeField.maxSize.value} ${largestSizeField.maxSize.unit}`,
              HttpStatus.BAD_REQUEST,
            );
          }
          if (err.code === 'LIMIT_FILE_COUNT') {
            throw new HttpException(
              `Too many files uploaded for one or more fields`,
              HttpStatus.BAD_REQUEST,
            );
          }
          throw new HttpException(err.message || 'File upload failed', HttpStatus.BAD_REQUEST);
        }

        this.logger.log(
          `Successfully uploaded files: ${JSON.stringify(
            Object.keys(request.files || {}).map(field => ({
              field,
              count: request.files[field]?.length || 0,
            })),
          )}`,
        );

        observer.next(next.handle());
        observer.complete();
      });
    });
  }
}