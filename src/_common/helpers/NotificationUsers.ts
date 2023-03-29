import { FABRIC_CUSTOMER_ADMIN, FABRIC_SUPPLIER_ADMIN } from '@app/auth';
import { CUSTOMER_NOTIFICATION_TYPES, EVENT_TYPES } from '../constants';

export const notificationUserRoles = (
  eventType: number,
): Record<string, any> => {
  switch (eventType) {
    case EVENT_TYPES.QUOTE_ALLOCATION: {
      const userRoles = [FABRIC_SUPPLIER_ADMIN];
      return userRoles;
    }
    case EVENT_TYPES.QUOTE_SUBMISSION_ON_BEHALF: {
      const userRoles = [FABRIC_SUPPLIER_ADMIN];
      return userRoles;
    }
    case EVENT_TYPES.BID_LOST_WHEN_QUOTE_CREATED: {
      const userRoles = [FABRIC_SUPPLIER_ADMIN];
      return userRoles;
    }
    case EVENT_TYPES.BID_LOST_WHEN_QUERY_IN_PICKED: {
      const userRoles = [FABRIC_SUPPLIER_ADMIN];
      return userRoles;
    }
    case EVENT_TYPES.ORDER_CONFIRMED: {
      const userRoles = [FABRIC_SUPPLIER_ADMIN, FABRIC_CUSTOMER_ADMIN];
      return userRoles;
    }
    case EVENT_TYPES.QUERY_REQUEST_CLOSED: {
      const userRoles = [FABRIC_SUPPLIER_ADMIN, FABRIC_CUSTOMER_ADMIN];
      return userRoles;
    }
    case EVENT_TYPES.ORDER_CANCELLED: {
      const userRoles = [FABRIC_SUPPLIER_ADMIN];
      return userRoles;
    }
    case EVENT_TYPES.ORDER_QUANTITY_CHANGED: {
      const userRoles = [FABRIC_SUPPLIER_ADMIN];
      return userRoles;
    }
    case EVENT_TYPES.GREIGE_DISPATCHED_FOR_JOB_WORK_SUPPLIER: {
      const userRoles = [FABRIC_SUPPLIER_ADMIN];
      return userRoles;
    }
    case CUSTOMER_NOTIFICATION_TYPES.NEW_FABRIC_QUERY_REQUESTED: {
      const userRoles = [FABRIC_CUSTOMER_ADMIN];
      return userRoles;
    }
    case CUSTOMER_NOTIFICATION_TYPES.QUOTE_PRICE_CHANGED: {
      const userRoles = [FABRIC_CUSTOMER_ADMIN];
      return userRoles;
    }
    case CUSTOMER_NOTIFICATION_TYPES.ORDER_EDITED_BY_SM: {
      const userRoles = [FABRIC_CUSTOMER_ADMIN];
      return userRoles;
    }
    case CUSTOMER_NOTIFICATION_TYPES.QUOTE_RECEIVED_ON_REQUEST: {
      const userRoles = [FABRIC_CUSTOMER_ADMIN];
      return userRoles;
    }
    case CUSTOMER_NOTIFICATION_TYPES.ORDER_DISPATCHED: {
      const userRoles = [FABRIC_CUSTOMER_ADMIN];
      return userRoles;
    }
    case CUSTOMER_NOTIFICATION_TYPES.ORDER_DISPATCH_DELIVERED: {
      const userRoles = [FABRIC_CUSTOMER_ADMIN];
      return userRoles;
    }
    case CUSTOMER_NOTIFICATION_TYPES.ORDER_PG_PAYMENT: {
      const userRoles = [FABRIC_CUSTOMER_ADMIN];
      return userRoles;
    }
    case CUSTOMER_NOTIFICATION_TYPES.ORDER_VPA_PAYMENT: {
      const userRoles = [FABRIC_CUSTOMER_ADMIN];
      return userRoles;
    }
    case CUSTOMER_NOTIFICATION_TYPES.WAREHOUSE_REMINDER: {
      const userRoles = [FABRIC_CUSTOMER_ADMIN];
      return userRoles;
    }
    case CUSTOMER_NOTIFICATION_TYPES.RETURN_WINDOW_CLOSING_ALERT: {
      const userRoles = [FABRIC_CUSTOMER_ADMIN];
      return userRoles;
    }
    default: {
      return null;
    }
  }
};

export const getNotificationUserDetails = (
  inputs: Record<string, any>,
): Record<string, any>[] => {
  const { userRoles, orgUserDetails = [] } = inputs;
  const userData = [];

  userRoles.forEach((role: string) => {
    userData.push({
      role,
      userDetails: orgUserDetails.filter(
        (orgUser: Record<string, any>) => orgUser.role === role,
      ),
    });
  });

  return userData;
};
