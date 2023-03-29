import { UnprocessableEntityException } from '@nestjs/common';
import moment from 'moment';

export const isDateValid = (date: string) => {
  if (!date) {
    throw new Error('No date provided');
  }

  return moment(date).isValid();
};

export const getFormattedDateString = (
  dateTime: string,
  format: string = 'YYYY-MM-DD HH:mm:ss',
) => {
  if (dateTime) {
    const momentDateTime = moment(dateTime);

    if (!momentDateTime.isValid()) {
      throw new UnprocessableEntityException('Invalid date provided');
    }

    return momentDateTime.format(format);
  }

  return null;
};

export const getCommaFormattedValue = (
  number: number | string,
  precision = 2,
) => {
  return parseFloat(String(number)).toLocaleString('en-IN', {
    minimumFractionDigits: precision,
    maximumFractionDigits: 2,
  });
};

export const getNameFormattedEmailId = (user: Record<string, any>): string => {
  if (user && user.name && user.email) {
    return `${user.name} <${user.email}>`;
  } else {
    return '';
  }
};
