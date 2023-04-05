import * as Knex from 'knex';
import { commonFields, id } from '../helper';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('fabric_supplier_address', function (table) {
    id(table),
      table
        .bigInteger('supplier_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('invoicing_root');
    table.string('building_name').defaultTo('');
    table.string('door_number').defaultTo('');
    table.string('location').defaultTo('');
    table.string('pincode').defaultTo('');
    table.string('state_name').defaultTo('');
    table.string('street').defaultTo('');
    commonFields(knex, table);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('fabric_supplier_address');
}
