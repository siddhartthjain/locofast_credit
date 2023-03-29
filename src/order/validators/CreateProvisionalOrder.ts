import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProvisionalOrder {
  @IsDefined()
  @IsNumber()
  brandId: number;

  @IsDefined()
  @IsString()
  fabricName: string;

  @IsDefined()
  @IsString()
  fabricSpecification: string;

  @IsDefined()
  @IsString()
  hsnCode: string;

  @IsDefined()
  @IsString()
  billTo: string;

  @IsDefined()
  @IsString()
  estimatedDeliveryDate: string;

  @IsOptional()
  @IsString()
  terms: string;

  @IsDefined()
  @IsNumber()
  supplierId: number;

  @IsDefined()
  @IsNumber()
  quantity: number;

  @IsDefined()
  @IsNumber()
  procurementPrice: number;

  @IsDefined()
  @IsNumber()
  unitId: number;

  @IsDefined()
  @IsNumber()
  brandDeliveryAddressId: number;
}
