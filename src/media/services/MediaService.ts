import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import * as sharp from 'sharp';
import { lastValueFrom } from 'rxjs';
import { FileDetails, ResizeOptions } from '../interfaces';

@Injectable()
export class MediaService {
  private s3: AWS.S3;

  constructor(
    private readonly config: ConfigService,
    private httpService: HttpService,
  ) {
    const s3Config = this.config.get('services.s3');
    const s3 = new AWS.S3();
    this.s3 = s3;

    AWS.config.update({
      secretAccessKey: s3Config.secretAccessKey,
      accessKeyId: s3Config.accessKeyId,
      region: s3Config.region,
    });
  }

  _composeObjectKey({
    originalname,
    prefix,
  }: {
    originalname: string;
    prefix?: string;
  }) {
    return `${prefix || ''}${originalname}`.replace(/\s/g, '-');
  }

  async uploadImage(
    file: { buffer: any; originalname: any },
    bucketName: any,
    resizeOptions: ResizeOptions,
    prefix?: string,
  ): Promise<string> {
    const image = await sharp(file.buffer);
    const { format } = await image.metadata();
    const config = {
      jpeg: { quality: 60 },
      png: { compressionLevel: 8 },
    };

    return await image[format](config[format])
      .resize(resizeOptions)
      .toBuffer()
      .then(async (data) => {
        const uploadedImage = await this.s3
          .upload({
            Bucket: bucketName,
            Key: this._composeObjectKey({
              originalname: file.originalname,
              prefix,
            }),
            Body: data,
            ACL: 'public-read',
          })
          .promise();
        return uploadedImage.Location;
      });
  }

  async uploadFile(
    file: { buffer: any; originalname: any },
    bucketName: any,
  ): Promise<string> {
    const uploadedFile = await this.s3
      .upload({
        Bucket: bucketName,
        Key: this._composeObjectKey({ originalname: file.originalname }),
        Body: file.buffer,
        ACL: 'public-read',
      })
      .promise();
    return uploadedFile.Location;
  }

  async copyObjectsToTargetBucket(
    fileDetails: FileDetails[],
  ): Promise<Record<string, any>[]> {
    const {
      headers,
      api: { copyObject: copyObjectApi },
    } = this.config.get('services.mediaUpload');

    const requestData = {
      fileDetails: fileDetails.map((file) => {
        const { fileName, targetBucket } = file;
        if (!fileName || !targetBucket) {
          throw new InternalServerErrorException(
            'Cannot move file to targeted bucket',
          );
        }
        return file;
      }),
    };

    try {
      const response: Record<string, any> = await lastValueFrom(
        this.httpService[copyObjectApi.method.toLowerCase()](
          copyObjectApi.url,
          requestData,
          { headers },
        ),
      );
      return response.data.data.movedFiles || [];
    } catch (error) {
      console.error('Error while copying object to final bucket', error);
      throw new InternalServerErrorException('Error while uploading file');
    }
  }

  async getObjectMetadata(inputs: Record<string, any>) {
    try {
      const { bucketName, key } = inputs;
      const params = {
        Bucket: bucketName,
        Key: key,
      };
      const objectMetadata = await this.s3.headObject(params).promise();
      return objectMetadata;
    } catch (error) {
      console.log('Error while fetching file metadata', error);
      throw new InternalServerErrorException(
        'Error while fetching file metadata',
      );
    }
  }
}
