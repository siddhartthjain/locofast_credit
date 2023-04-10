export type FileDetails = {
  fileName: string;
  targetBucket: string;
};

export type ValidateFilesInput = {
  fileMetaData: Record<string, any>;
  allowedSize?: number;
  allowedTypes?: [string];
};
