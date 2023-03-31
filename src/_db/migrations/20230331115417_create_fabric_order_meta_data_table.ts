import * as Knex from 'knex';
import { commonFields, id } from '../helper';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('fabric_order_meta_data', function (table) {
    id(table),
      table
        .bigInteger('order_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('fabric_orders');
    table.decimal('order_value', 12, 2).notNullable();
    table.decimal('payable_amount', 12, 2).notNullable();
    table
      .specificType('credit_period', 'TINYINT(2)')
      .notNullable()
      .defaultTo(30);
    table.integer('credit_charges').notNullable().defaultTo(2);
    table.boolean('is_active').defaultTo(1);
    commonFields(knex, table);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('fabric_order_meta_data');
}
