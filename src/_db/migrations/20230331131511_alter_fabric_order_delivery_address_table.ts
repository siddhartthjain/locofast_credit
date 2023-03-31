import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('fabric_order_delivery_address', (table) => {
    table.string('terms').defaultTo('').alter();
  });
}

export async function down(knex: Knex): Promise<void> {}
