import { VARIABLE_QUANTITY } from './constants';

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
  return price;
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
