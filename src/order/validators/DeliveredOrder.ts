import { IsDefined, IsString } from 'class-validator';

export class DeliveredOrder {
  @IsDefined()
  @IsString()
  deliveredDate: string;

  @IsDefined()
  @IsString()
  proofOfDelivery: string;
}
