// import { table } from "console";
import * as Knex from 'knex';
import { commonFields, id } from '../helper';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('invoicing_users', (table) => {
    id(table);
    table.integer('user_id');
    table.integer('brand_id');
    table.string('role').notNullable();
    table
      .bigInteger('root_id')
      .unsigned()
      .references('id')
      .inTable('invoicing_root');
    table.string('first_name');
    table.string('last_name');
    table.string('phone_no');
    table.string('user_secret_key');
    table
      .timestamp('created_on')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'));

    table
      .timestamp('modified_on')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
  });
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.dropSchemaIfExists('invoicing_users');
}
