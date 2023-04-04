import * as Knex from 'knex';
import { commonFields, id } from '../helper';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('invoicing_root', function (table) {
    id(table);
    table.bigInteger('brand_id');
    table.string('name').notNullable();
    table.integer('brandtype').notNullable(); // customer supplier
    table.string('gst').notNullable();
    table.string('secret_key');
    table.boolean('is_active').defaultTo(1);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('invoicing_root');
}
