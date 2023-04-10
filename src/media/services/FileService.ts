import { HttpService } from '@nestjs/axios';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MediaService } from './MediaService';
import { ValidateFilesInput } from '../interfaces';
import { ALLOWED_FILE_DEFAULT_SIZE, ALLOWED_FILE_TYPES } from '@app/_common';

@Injectable()
export class FileService {
  private tempFileBucket;
  constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
    private readonly mediaService: MediaService,
  ) {
    const s3ServiceConfig = this.config.get('services.s3');
    this.tempFileBucket = s3ServiceConfig.temp.bucketName;
  }

  async parseFileMetadataFromUrl(url: string): Promise<Record<string, any>> {
    try {
      const objectName = url.substring(url.lastIndexOf('/') + 1);
      const objectMetadata = await this.mediaService.getObjectMetadata({
        bucketName: this.tempFileBucket,
        key: objectName,
      });
      const bytesToMegabytesConversionFactor = 1000 * 1000; // 1 MB in bytes
      const metadata = {
        mimeType: objectMetadata.ContentType,
        fileSize:
          objectMetadata.ContentLength / bytesToMegabytesConversionFactor, // file size will be in MB
        originalName: objectName,
        fileUrl: url,
      };
      return metadata;
    } catch (error) {
      console.error('Error in parseFileMetadataFromUrl', error);
      throw new UnprocessableEntityException(`Invalid file url: ${url}`);
    }
  }

  validateFiles(filesMetaData: ValidateFilesInput[]) {
    filesMetaData.forEach((file) => {
      const { fileMetaData, allowedSize, allowedTypes } = file;
      const maximumSizeAllowed = allowedSize || ALLOWED_FILE_DEFAULT_SIZE;
      const mimeTypesAllowed = allowedTypes || Object.keys(ALLOWED_FILE_TYPES);

      if (fileMetaData.fileSize > maximumSizeAllowed) {
        throw new UnprocessableEntityException(
          `File size must be less than ${maximumSizeAllowed} MB`,
        );
      }

      if (!mimeTypesAllowed.includes(fileMetaData.mimeType)) {
        throw new UnprocessableEntityException(`File type is not allowed`);
      }
    });
  }
}
