import {
  IsDefined,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
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
  @Min(1)
  @Max(1000000)
  quantity: number;

  @IsDefined()
  @IsNumber()
  procurementPrice: number;

  @IsDefined()
  @IsNumber()
  unitId: number;
}
