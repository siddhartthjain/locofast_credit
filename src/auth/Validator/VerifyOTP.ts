import {
  IsDefined,
  Length,
  IsString,
  IsOptional,
  MinLength,
  IsIn,
  IsEmail,
  ValidateIf,
} from '@libs/core/validator';
import { APP_TYPE } from '../constants';

export class VerifyOTP {
  @ValidateIf(o => !o.email)
  @IsDefined()
  @IsString()
  @Length(10, 10)
  mobile: string;

  @ValidateIf(o => !o.mobile)
  @IsDefined()
  @IsString()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsString()
  @Length(4)
  otp: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @IsIn(Object.values(APP_TYPE))
  appType: string;
}
