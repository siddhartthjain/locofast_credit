import { env } from '@libs/core';
import { registerAs } from '@nestjs/config';

// all third-party services' configurations to go here
export default registerAs('services', () => ({

    api: {
        loginWithMobile: {
          url: `${process.env.APP_URL}${process.env.API_USERMODULE_URL}/mobileLogin`,
        },
        library: {
          sendSMS: {
            url: process.env.MSG_91_URL,
            body: {
              sender: process.env.MSG_91_SENDER,
            },
            headers: {
              authkey: process.env.MSG_91_AUTH_KEY,
            },
            flowId: {
              loginOtp: process.env.MSG_91_OTP_FLOW_ID,
              referenceCode: process.env.MSG_91_ORDER_REFERENCE_CODE_FLOW_ID,
              bulkApprovalCode: process.env.MSG_91_BULK_APPROVAL_CODE_FLOW_ID,
            },
          },
        },
        notification: {
          url: process.env.NOTIFICATION_SERVICE_BASE_URL
            ? `${process.env.NOTIFICATION_SERVICE_BASE_URL}/notifications`
            : null,
        },
        whatsappOptOut: {
          url: `${process.env.NOTIFICATION_SERVICE_BASE_URL}/users/whatsapp/opt-out`,
        },
      },
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
