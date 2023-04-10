import {
  IsArray,
  IsDecimal,
  IsDefined,
  IsNumberString,
  IsString,
} from 'class-validator';

export class DispatchOrder {
  @IsDefined()
  @IsNumberString()
  orderId: number;

  @IsDefined()
  @IsDecimal()
  quantity: number;

  @IsDefined()
  @IsArray()
  orderPictures: string[];

  @IsDefined()
  @IsString()
  locofastInvoice: string;
}
