import { GST } from '@app/_common';
import { ORDER_STATUS, ORDER_TABS, VARIABLE_QUANTITY } from './constants';
import { GetOrders } from './interfaces';

export const calculateCreditPrice = (
  amount: number,
  charges: number,
): number => {
  const price = amount + (amount * charges) / 100;
  return price;
};

export const calculateOrderValue = (
  procurementPrice: number,
  quantity: number,
) => {
  const price = procurementPrice * quantity;
  const finalPrice = price + (price * GST) / 100;
  return Number(finalPrice.toFixed(2));
};

export const checkQuantity = (
  requiredQuantity: number,
  markedQuantity: number,
): boolean => {
  const lowerLimit =
    requiredQuantity - (requiredQuantity * VARIABLE_QUANTITY) / 100;
  const upperLimit =
    requiredQuantity + (requiredQuantity * VARIABLE_QUANTITY) / 100;

  return markedQuantity >= lowerLimit && markedQuantity <= upperLimit;
};

export const orderStatus = (inputs: GetOrders) => {
  let statusArray = [];
  if (inputs.orderTab === ORDER_TABS.ALL_ORDERS) {
    statusArray.push(ORDER_STATUS.DISPATCHED);
    statusArray.push(ORDER_STATUS.PROVISIONAL);
    statusArray.push(ORDER_STATUS.CREATED);
  } else if (inputs.orderTab === ORDER_TABS.VERIFICATION_PENDING) {
    statusArray.push(ORDER_STATUS.PROVISIONAL);
  } else if (inputs.orderTab === ORDER_TABS.PO_RAISED) {
    statusArray.push(ORDER_STATUS.DISPATCHED);
    statusArray.push(ORDER_STATUS.CREATED);
  } else if (inputs.orderTab === ORDER_TABS.PRODUCTION) {
    statusArray.push(ORDER_STATUS.CREATED);
    //statusArray.push(ORDER_STATUS.DISPATCHED) need to ask
  } else {
    statusArray.push(ORDER_STATUS.DELIVERED);
  }
  return statusArray;
};

export const activeOrders = (
  inputs: Record<string, any>[],
): Record<string, any> => {
  const data = {
    provisionalOrders: 0,
    poRaisedOrders: 0,
  };

  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].status === ORDER_STATUS.PROVISIONAL) {
      data.provisionalOrders += inputs[i].count;
    } else if (inputs[i].status === ORDER_STATUS.CREATED) {
      data.poRaisedOrders += inputs[i].count;
    }
  }

  return data;
};
