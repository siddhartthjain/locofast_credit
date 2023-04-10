import { InvoicingRoot } from '@app/_common/models/InvoicingRoot';
import { Fabric } from '@app/fabric';
import { BaseModel } from '@libs/core';
import { FabricOrderMetaData } from './FabricOrderMetaData';
import { FabricOrderDeliveryAddress } from './FabricOrderDeliveryAddress';
import { Units } from '@app/_common';
import { FabricOrderFiles } from './FabricOrderFile';
import { FILE_TYPE, ORDER_STATUS } from '../constants';

export class FabricOrder extends BaseModel {
  static tableName = 'fabric_orders';

  static relationMappings() {
    return {
      fabric: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Fabric,
        join: {
          from: 'fabric_orders.fabric_id',
          to: 'fabrics.id',
        },
      },
      supplier: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: InvoicingRoot,
        join: {
          from: 'fabric_orders.supplier_id',
          to: 'invoicing_root.id',
        },
      },
      payment: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: FabricOrderMetaData,
        filter: (builder) =>
          builder.where('fabric_order_meta_data.is_active', 1),
        join: {
          from: 'fabric_orders.id',
          to: 'fabric_order_meta_data.order_id',
        },
      },
      delivery: {
        relation: BaseModel.HasOneRelation,
        modelClass: FabricOrderDeliveryAddress,
        join: {
          from: 'fabric_order_delivery_address.order_id',
          to: 'fabric_orders.id',
        },
      },
      unit: {
        relation: BaseModel.HasOneRelation,
        modelClass: Units,
        join: {
          from: 'fabric_orders.unit_id',
          to: 'units.id',
        },
      },
      orderFiles: {
        relation: BaseModel.HasManyRelation,
        modelClass: FabricOrderFiles,
        filter: (builder) =>
          builder.whereIn('fabric_order_files.file_type', [
            FILE_TYPE['Order Picture'],
            FILE_TYPE['Locofast Invoice'],
          ]),
        join: {
          from: 'fabric_orders.id',
          to: 'fabric_order_files.order_id',
        },
      },
      customerFiles: {
        relation: BaseModel.HasOneRelation,
        modelClass: FabricOrderFiles,
        filter: (builder) =>
          builder.where(
            'fabric_order_files.file_type',
            FILE_TYPE['Proforma Invoice'],
          ),
        join: {
          from: 'fabric_orders.id',
          to: 'fabric_order_files.order_id',
        },
      },
    };
  }
}
