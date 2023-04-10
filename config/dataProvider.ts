import { registerAs } from '@nestjs/config';

const baseUrl = process.env.DATA_PROVIDER_BASE_URL;

export default registerAs('dataProvider', () => ({
  headers: {
    'data-access-key': process.env.DATA_PROVIDER_ACCESS_KEY || '1234',
  },
  api: {
    getVPADetails: {
      url: `${baseUrl}/payment/get-vpa-details`,
      method: 'GET',
    },
    getAllSuppliers: {
      url: `${baseUrl}/supplier`,
      method: 'GET',
    },
    getTopSellingData: {
      url: `${baseUrl}/top-selling/:productHash`,
      method: 'GET',
    },
    getCustomerData: {
      url: `${baseUrl}/customer/:customerId`,
      method: 'GET',
    },
    getUserData: {
      url: `${baseUrl}/common/:userId`,
      method: 'GET',
    },
  },
}));
