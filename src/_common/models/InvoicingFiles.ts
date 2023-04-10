import { BaseModel } from '@libs/core';

export class InvoicingFiles extends BaseModel {
  static tableName = 'invoicing_files';

  static modifiers = {
    invoicingFileDetails(query) {
      query.select('id as fileId');
      query.select('title');
      query.select('file_type as fileFormat');
      query.select('name');
      query.select('mime_type');
      query.select('url');
    },
  };
}
