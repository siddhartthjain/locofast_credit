import { env } from '@libs/core';
import { registerAs } from '@nestjs/config';

// all third-party services' configurations to go here
export default registerAs('services', () => ({
  s3: {
    accessKeyId: env('AWS_ACCESS_KEY_ID'),
    secretAccessKey: env('AWS_SECRET_ACCESS_KEY'),
    region: env('AWS_REGION'),
    finance: {
      bucketName: env('AWS_S3_FINANCE_FILES_BUCKET_NAME'),
    },
    order: {
      bucketName: env('AWS_S3_ORDER_FILES_BUCKET_NAME'),
    },
    temp: {
      bucketName: env('AWS_S3_TEMP_FILES_BUCKET_NAME'),
    },
  },

  mediaUpload: {
    headers: {
      'x-api-key': env('MEDIA_UPLOAD_SERVICE_API_KEY'),
    },
    api: {
      copyObject: {
        url: `${env('MEDIA_UPLOAD_SERVICE_BASE_URL')}/s3/copy-object`,
        method: 'POST',
      },
    },
  },
}));
