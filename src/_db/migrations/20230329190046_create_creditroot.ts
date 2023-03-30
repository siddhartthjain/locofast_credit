import * as Knex from 'knex';
import { commonFields, id } from '../helper';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('invoicing_root', function (table) {
    id(table);
    table
      .bigInteger('brand_id')
     
    table.string('name').notNullable();
    table.integer("brandtype").notNullable();
    table.boolean('is_credit_available').defaultTo(1);
    table
      .specificType('credit_period', 'TINYINT(2)')
      .unsigned()
      .notNullable()
      .defaultTo(30);
    table.integer('credit_charges').notNullable().defaultTo(2); 
    table
    .string('secretKey') 
     
    commonFields(knex, table);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('invoicing_root');
}
