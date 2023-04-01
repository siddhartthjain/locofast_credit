import {
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class DeliveryAddress {
  @IsDefined()
  @IsString()
  @MinLength(1)
  consigneeName: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  phone: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  addressLine1: string;

  @IsOptional()
  @IsString()
  addressLine2: string;

  @IsOptional()
  @IsString()
  landmark: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  city: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  state: string;

  @IsDefined()
  @IsNumber()
  pinCode: number;

  @IsDefined()
  @IsString()
  estimatedDeliveryDate: string;

  @IsOptional()
  @IsString()
  terms: string;
}
