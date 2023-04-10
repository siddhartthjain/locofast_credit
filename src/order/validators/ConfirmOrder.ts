import { IsDefined, IsNumber, IsString } from 'class-validator';

export class ConfirmOrder {
  @IsDefined()
  @IsString()
  orderId: string;

  @IsDefined()
  @IsString()
  proformaInvoice: string;
}
