import {
  IsDefined,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

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
  @MinLength(1)
  @MaxLength(8)
  @IsString()
  hsnCode: string;

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
}
