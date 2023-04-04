import * as Knex from 'knex';
import { commonFields } from '../helper';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('invoicing_users', (table) => {
    table
      .bigInteger('created_by')
      .unsigned()
      .references('id')
      .inTable('invoicing_users');
    table
      .bigInteger('modified_by')
      .unsigned()
      .references('id')
      .inTable('invoicing_users');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('invoicing_users', (table) => {
    table.dropColumns('created_on', 'modified_on', 'created_by', 'modified_by');
  });
}
