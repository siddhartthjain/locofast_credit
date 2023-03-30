import * as Knex from 'knex';
import { commonFields, id } from '../helper';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    'fabric_order_delivery_address',
    function (table) {
      id(table);
      table
        .bigInteger('order_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('fabric_orders');
      table.string('bill_to').notNullable();
      table.string('consignee_name');
      table.string('phone');
      table.string('address_line1');
      table.string('address_line2');
      table.string('landmark');
      table.string('city');
      table.string('state');
      table.string('country').defaultTo('India');
      table.integer('pin_code').unsigned();
      table.boolean('is_international').defaultTo(false);
      table.timestamp('estimated_delivery_date').notNullable();
      table.string('terms');
      commonFields(knex, table);
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('fabric_order_delivery_address');
}
