import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('fabric_orders', function (table) {
    table.dropColumn('credit_price');
  });
}

export async function down(knex: Knex): Promise<void> {}
