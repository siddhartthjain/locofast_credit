import { BaseModel } from '@libs/core';

export class FabricOrderDeliveryAddress extends BaseModel {
  static tableName = 'fabric_order_delivery_address';

  static modifiers = {
    deliveryDetails(query) {
      query.select('consignee_name');
      query.select('phone');
      query.select('address_line1');
      query.select('address_line2');
      query.select('landmark');
      query.select('city');
      query.select('state');
      query.select('country');
      query.select('pin_code');
      query.select('is_international');
      query.select('estimated_delivery_date');
      query.select('terms');
    },
  };
}
