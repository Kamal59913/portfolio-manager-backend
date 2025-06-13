import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    Logger,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  
  @Catch(HttpException)
  export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);
  
    catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
      const status = exception.getStatus();
  
      const errorResponse = {
        success: false,
        message: exception.message,
        status: status,
        path: request.url,
        timestamp: new Date().toISOString(),
      };
  
    //   this.logger.error(
    //     `HTTP Exception: ${status} ${request.method} ${request.url}`,
    //     exception.stack,
    //   );
  
      response.status(status).json(errorResponse);
    }
  }