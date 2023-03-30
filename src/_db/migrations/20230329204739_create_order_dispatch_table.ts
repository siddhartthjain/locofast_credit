import * as Knex from 'knex';
import { commonFields, id } from '../helper';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('fabric_order_dispatch', function (table) {
    id(table);
    table
      .bigInteger('order_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('fabric_orders');
    table.decimal('quantity', 12, 2);
    table.timestamp('dispatch_date').notNullable();
    table.timestamp('delivered_date').nullable();
    commonFields(knex, table);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('fabric_order_dispatch');
}
