import * as Knex from 'knex';
import { id, commonFields } from '../helper';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('fabric_order_files', (table) => {
    id(table);
    table
      .bigInteger('order_id')
      .notNullable()
      .references('id')
      .inTable('fabric_orders');
    table
      .bigInteger('file_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('invoicing_files');
    // 1: Proforma Invoice 2: Order Pictures 3: Locofast Invoice 4: Proof Of Delivery
    table.specificType('file_type', 'TINYINT');

    commonFields(knex, table);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('fabric_order_files');
}
