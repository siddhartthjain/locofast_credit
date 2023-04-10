import { InvoicingFiles } from '@app/_common';
import { BaseModel } from '@libs/core';

export class FabricOrderFiles extends BaseModel {
  static tableName = 'fabric_order_files';

  static modifiers = {
    fabricOrderFilesDetails(query) {
      query.select('file_type as fabricOrderFileType');
    },
  };

  static relationMappings() {
    return {
      file: {
        relation: BaseModel.HasOneRelation,
        modelClass: InvoicingFiles,
        join: {
          from: 'fabric_order_files.file_id',
          to: 'invoicing_files.id',
        },
      },
    };
  }
}
