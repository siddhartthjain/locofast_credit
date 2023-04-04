import { InvoicingRoot } from '@app/_common/models/InvoicingRoot';
import { Fabric } from '@app/fabric';
import { BaseModel } from '@libs/core';
import { FabricOrderMetaData } from './FabricOrderMetaData';
import { FabricOrderDeliveryAddress } from './FabricOrderDeliveryAddress';

export class FabricOrder extends BaseModel {
  static tableName = 'fabric_orders';

  static relationMappings() {
    console.log(this.modelPaths);
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
    };
  }
}
