import { Injectable } from '@nestjs/common';
import { DatabaseRepository as DB, InjectModel } from '@libs/core/db/';
import { InvoicingFilesContract } from '../contracts';
import { InvoicingFiles } from '@app/_common/models';

@Injectable()
export class InvoicingFileRepository
  extends DB
  implements InvoicingFilesContract
{
  @InjectModel(InvoicingFiles)
  model: InvoicingFiles;
}
