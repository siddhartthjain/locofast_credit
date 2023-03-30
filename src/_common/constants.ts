export const LOCO_ADMIN_USER_ID_KEY = 'LocoAdminUserId';

export const USER_REPOSITORY = 'USER_REPOSITORY';
export const LF_ROOT_REPOSITORY = 'LF_ROOT_REPOSITORY';
export const CURRENCY_REPOSITORY = 'CURRENCY_REPOSITORY';

// Fabric ID
export const GENERATED_ID_PREFIX = 'LFB-';
export const GENERATED_ID_MIN_LENGTH = 4;

export const LOCALIZED_DATE = 'MMM DD, YYYY';
export const LOCALIZED_DATE_TIME = 'MMM DD, YYYY h:mm a';

export const IMAGE_FILE_TYPES = {
  'image/jpeg': 1,
  'image/jpg': 1,
  'image/png': 1,
};

export const ALLOWED_FILE_TYPES = {
  'image/jpeg': 1,
  'image/jpg': 1,
  'image/png': 1,
  'application/vnd.ms-excel': 2,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 2,
  'application/vnd.google-apps.spreadsheet': 2,
  'text/csv': 2,
  'application/pdf': 3,
  'text/plain': 5,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 5,
};

export const ACTIVATION_STATUS = {
  ACTIVE: 'Y',
  INACTIVE: 'N',
};

export const EVENT_TYPES = {
  NEW_FABRIC_REQUESTS: 1,
  QUOTE_ALLOCATION: 2,
  QUOTE_SUBMISSION_ON_BEHALF: 3,
  BID_LOST_WHEN_QUOTE_CREATED: 4,
  BID_LOST_WHEN_QUERY_IN_PICKED: 5,
  QUERY_REQUEST_CLOSED: 6,
  ORDER_CONFIRMED: 7,
  ORDER_DISPATCH_SCHEDULED_TOMORROW: 8,
  ORDER_CANCELLED: 9,
  ORDER_QUANTITY_CHANGED: 10,
  GREIGE_DISPATCHED_FOR_JOB_WORK_SUPPLIER: 11,
};

export const CUSTOMER_NOTIFICATION_TYPES = {
  NEW_FABRIC_QUERY_REQUESTED: 101,
  QUOTE_RECEIVED_ON_REQUEST: 102,
  QUOTE_PRICE_CHANGED: 103,
  QUOTE_EXPIRING: 104,
  ORDER_EDITED_BY_SM: 105,
  QUERY_REQUEST_CLOSED: 106,
  ORDER_PLACED: 107,
  ORDER_DISPATCHED: 108,
  ORDER_DISPATCH_DELIVERED: 109,
  ORDER_PG_PAYMENT: 110,
  ORDER_VPA_PAYMENT: 111,
  WAREHOUSE_REMINDER: 112,
  RETURN_WINDOW_CLOSING_ALERT: 113,
};
// export const LF_ROOT_REPOSITORY = 'LF_ROOT_REPOSITORY';

export const CREDIT_CUSTOMER_REPO = 'CREDIT_CUSTOMER_REPO';
export const CREDIT_USER_REPO = 'CREDIT_USER_REPO';

export const GST_NUMBER_REGEX =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]{2}[0-9A-Z]$/;

export const BILL_TO = 'Locofast Online Private Limited';

export const INVOICING_ROOT_REPO= 'INVOICING_ROOT_REPO';
export const INVOICING_USER_REPO= 'INVOICING_USER_REPO';

export const ROOT_USER_TYPES={
  CREDIT_CUSTOMER: 21,
  SUPPLIER :22
}

