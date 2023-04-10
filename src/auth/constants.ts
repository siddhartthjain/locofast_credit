export const skipAuthRoutes = [
    '/auth/otp/send',
    '/auth/otp/verify',
    '/common/app-version-config',
    '/customer/create',
    '/common/app-redirect',
    '/common/whatsapp-bot',
    '/whatsapp/send/customers/welcome-message',
  ];
  
  export const OTP_ROUTES_TTL = 60;
  export const OTP_ROUTES_LIMIT = 6;
  
  export const APP_TYPE = {
    CUSTOMER: 'Customer',
    SUPPLIER: 'Supplier',
    SUPPLIER_NATIVE: 'SupplierNative',
    FINANCE_INVOICING:"FinanceInvoicing"
  };
  
  export const APP_LINK = {
    SUPPLY_APP_LINK:
      'https://play.google.com/store/apps/details?id=in.locofast.fabricapp.twa',
    CUSTOMER_APP_LINK:
      'https://play.google.com/store/apps/details?id=com.locofastcustomerapp',
  };
  
  //Loco Admin
export const LOCO_ADMIN = '1';

//Fabric App - User Roles
export const FABRIC_SUPPLIER_ADMIN = '10';
export const FABRIC_CUSTOMER_ADMIN = '11';
export const ACCOUNT_MANAGER = '12';
export const SUPPLIER_MANAGER = '13';
export const SALES_HEAD = '14';
export const LOGISTICS_MANAGER = '15';
export const SUPPLY_HEAD = '16';
export const FINANCE_MANAGER = '17';
export const CREDIT_CUTOMER='21';
export const SUPPLIER= '22'
