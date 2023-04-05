import { IsDefined, IsString } from 'class-validator';

export class SupplierAddress {
  @IsDefined()
  @IsString()
  tradeName: string;

  @IsDefined()
  @IsString()
  buildingName: string;

  @IsDefined()
  @IsString()
  doorNumber: string;

  @IsDefined()
  @IsString()
  location: string;

  @IsDefined()
  @IsString()
  pincode: string;

  @IsDefined()
  @IsString()
  stateName: string;

  @IsDefined()
  @IsString()
  street: string;
}
