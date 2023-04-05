//not in use
/*
import * as Knex from 'knex';
import { commonFields, id } from '../helper';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('suppliers', function (table) {
    id(table);
    table.string('gst_number', 20).notNullable();
    table.string('first_name').notNullable();
    table.string('last_name').defaultTo('');
    table.string('contact_number', 20).notNullable();
    table.string('email').notNullable();
    commonFields(knex, table);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('suppliers');
}*/
