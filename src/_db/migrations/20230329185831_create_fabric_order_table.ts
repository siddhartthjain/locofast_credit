import * as Knex from 'knex';
import { commonFields, id } from '../helper';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('fabric_orders', function (table) {
    id(table);
    table
      .bigInteger('customer_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('invoicing_root');
    // maybe need to change to locofast root
    table
      .bigInteger('supplier_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('invoicing_root');
    table
      .bigInteger('fabric_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('fabrics');
    // 1-Provisional(verification-pending) , 2-Created(PO raised) , 3- Dispatched , 4-Delivered ,5-Cancelled
    table.specificType('status', 'TINYINT(1)').notNullable().defaultTo(1);
    table.decimal('quantity', 12, 2).notNullable();
    // price that will be used to calculate the original price (paid to supplier)
    table.decimal('procurement_price', 12, 2).notNullable();
    // price we will pay to the supplier
    table.decimal('order_value', 12, 2).notNullable();
    table
      .bigInteger('marked_delivered_by')
      .unsigned()
      .references('id')
      .inTable('invoicing_users');
    table
      .bigInteger('unit_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('units');
    commonFields(knex, table);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('fabric_orders');
}
