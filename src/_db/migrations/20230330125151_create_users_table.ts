import * as Knex from 'knex';
import { id } from '../helper';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', function (table) {
    id(table);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('users');
}
