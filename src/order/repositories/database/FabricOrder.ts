import { Injectable } from '@nestjs/common';
import { DatabaseRepository as DB, InjectModel } from '@libs/core';
import { FabricOrder } from 'src/order/models';
import { GetOrders } from '@app/order/interfaces';
import { ORDER_STATUS, ORDER_TABS } from '@app/order/constants';
import { FabricOrderContract } from '../contracts';
import { activeOrders, orderStatus } from '@app/order/helpers';
import { ROOT_USER_TYPES } from '@app/_common';
import get from 'lodash';
@Injectable()
export class FabricOrderRepository extends DB implements FabricOrderContract {
  @InjectModel(FabricOrder)
  model: FabricOrder;

  async getOrders(inputs: GetOrders): Promise<Record<string, any>> {
    const { limit, pageNo, orderTab, sortOrder, user } = inputs;
    let statusArray = orderStatus(inputs);
    let sortBy = '';
    if (orderTab === ORDER_TABS.DELIVERED) {
      sortBy = 'fod.delivered_date';
    } else {
      sortBy = 'fo.created_on';
    }
    // need to add mill address and gst information table
    // for mill address (Dispatched Order Case)
    let selectAble = [];
    if (user.role === ROOT_USER_TYPES.CREDIT_CUSTOMER) {
      selectAble = [
        'ivroot.name as orgName',
        'fo.id as order_id',
        'f.fabric_name',
        'f.generated_fabric_id as LFI',
        'fo.quantity',
        'u.short_name as unit',
        'f.fabric_specification',
        'fo.order_value as amount',
        'foda.estimated_delivery_date',
        'fo.status',
      ];
    } else if (user.role === ROOT_USER_TYPES.SUPPLIER) {
      selectAble = [
        'ivroot.name as orgName',
        'fo.id as order_id',
        'f.generated_fabric_id as LFI',
        'f.fabric_name',
        'fo.quantity',
        'u.short_name as unit',
        'f.fabric_specification',
        'fo.order_value as amount',
        'foda.estimated_delivery_date',
        'fo.status',
      ];
    }

    if (orderTab === ORDER_TABS.DELIVERED) {
      selectAble.push('fod.delivered_date');
    }

    let query = this.query()
      .alias('fo')
      .innerJoin('fabrics as f', 'f.id', 'fo.fabric_id')
      .innerJoin(
        'fabric_order_delivery_address as foda',
        'foda.order_id',
        'fo.id',
      )
      .innerJoin('units as u', 'fo.unit_id', 'u.id')
      .whereIn('fo.status', statusArray).orderByRaw(`
        CASE fo.status
          WHEN 3 THEN 1
          ELSE 2
        END,
        ${sortBy} ${sortOrder}
      `);

    if (user.role === ROOT_USER_TYPES.SUPPLIER) {
      query
        .innerJoin('invoicing_root as ivroot', 'ivroot.id', 'fo.customer_id')
        .where('fo.supplier_id', user.orgId);
    } else if (user.role === ROOT_USER_TYPES.CREDIT_CUSTOMER) {
      query
        .innerJoin('invoicing_root as ivroot', 'ivroot.id', 'fo.supplier_id')
        .where('fo.customer_id', user.orgId);
    }

    if (orderTab === ORDER_TABS.DELIVERED) {
      query.innerJoin('fabric_order_dispatch as fod', 'fo.id', 'fod.order_id');
    }

    const totalCountQuery = query.clone();

    if (pageNo && limit) {
      const skipData = (pageNo - 1) * limit;
      query.offset(skipData).limit(limit);
    }
    const order = await query.select(selectAble);
    const totalOrderCount = get(
      await totalCountQuery.count('fo.id as count').first(),
    );
    return {
      orders: order,
      count: totalOrderCount,
    };
  }

  async getActiveOrders(
    inputs: Record<string, any>,
  ): Promise<Record<string, any>> {
    const { orgId } = inputs;
    const orderStatus = [ORDER_STATUS.PROVISIONAL, ORDER_STATUS.CREATED];
    let query = this.query()
      .alias('fo')
      .whereIn('fo.status', orderStatus)
      .where('fo.customer_id', orgId)
      .groupBy('fo.status');
    query.select('fo.status').count('* as count');
    const result = await query;
    const data = activeOrders(result);

    let readyOrder = await this.query()
      .alias('fo')
      .select('f.fabric_name', 'ivroot.name as orgName')
      .innerJoin('invoicing_root as ivroot', 'ivroot.id', 'fo.supplier_id')
      .innerJoin('fabrics as f', 'f.id', 'fo.fabric_id')
      .innerJoin('fabric_order_dispatch as fod', 'fo.id', 'fod.order_id')
      .where('fo.status', ORDER_STATUS.DISPATCHED)
      .andWhere('fo.customer_id', orgId)
      .orderBy('fod.created_on', 'desc')
      .limit(1)
      .first();

    data.readyOrder = readyOrder;

    return { data };
  }
}
