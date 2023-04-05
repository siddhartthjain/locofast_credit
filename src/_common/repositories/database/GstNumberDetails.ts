import { Injectable } from '@nestjs/common';
import { DatabaseRepository as DB, InjectModel } from '@libs/core/db/';
import { GstNumberDetailsContract } from '../contracts';
import { GstNumberDetails } from '@app/_common/models';

@Injectable()
export class GstNumberDetailsRepository
  extends DB
  implements GstNumberDetailsContract
{
  @InjectModel(GstNumberDetails)
  model: GstNumberDetails;
}
