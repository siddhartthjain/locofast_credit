import * as Knex from 'knex';
import { id } from '../helper';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('invoicing_root', function (table) {
    id(table);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('invoicing_root');
}
