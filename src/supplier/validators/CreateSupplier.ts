import { GST_NUMBER_REGEX } from '@app/_common';
import {
  IsDefined,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateSupplier {
  @IsDefined()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firstName: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  lastName: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  contactNumber: string;

  @IsDefined()
  @IsEmail()
  email: string;

  @IsString()
  @Matches(RegExp(GST_NUMBER_REGEX), { message: 'Invalid GST format' })
  gstNumber: string;
}
