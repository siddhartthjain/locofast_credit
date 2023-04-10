import { GST_NUMBER_REGEX } from '@app/_common';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsIn,
  IsString,
  IsOptional,
  IsPhoneNumber,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  IsNumber,
} from 'class-validator';

export class InvoicingCustomerValidator {
  // @Type(() => Number)
  @IsDefined()
  @Type(() => Number)
  userId: number;

  @Type(() => Number)
  @IsDefined()
  @IsNumber()
  @Min(30)
  @Max(90)
  credit_period: number;

  @Type(() => Number)
  @IsDefined()
  @IsNumber()
  @Min(2)
  @Max(6)
  creditCharges: number;

  // @IsString()
  // @Matches(RegExp(GST_NUMBER_REGEX), { message: 'Invalid GST format' })
  // gst: string;

  // @IsPhoneNumber()
  // phoneNo: String
}
