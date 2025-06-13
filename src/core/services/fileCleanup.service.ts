import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';

@Injectable()
export class FileCleanupService {
  private readonly logger = new Logger(FileCleanupService.name);

  /**
   * Deletes files from the filesystem.
   * @param filePaths Array of file paths to delete.
   */
  async cleanupFiles(filePaths: string[]): Promise<void> {
    if (!filePaths || filePaths.length === 0) {
      return;
    }

    for (const filePath of filePaths) {
      try {
        await fs.unlink(filePath);
        this.logger.log(`Successfully deleted file: ${filePath}`);
      } catch (error) {
        this.logger.error(`Failed to delete file ${filePath}: ${error.message}`);
      }
    }
  }
}