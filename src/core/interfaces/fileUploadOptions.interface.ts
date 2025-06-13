export interface FileUploadOptions {
    fieldName: string;
    maxCount: number;
    allowedExtensions: string[];
    maxSize: {
      value: number;
      unit: 'KB' | 'MB';
    };
    destination?: string; // Subfolder name (e.g., 'avatars', 'documents'), defaults to 'uploads'
  }