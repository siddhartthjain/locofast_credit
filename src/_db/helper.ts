import * as Knex from 'knex';

export function id(table) {
  table.bigIncrements('id');
}

export function commonFields(knex: Knex, table) {
  table
    .timestamp('created_on')
    .notNullable()
    .defaultTo(knex.raw('CURRENT_TIMESTAMP'));

  table
    .timestamp('modified_on')
    .notNullable()
    .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));

  table.bigInteger('created_by').unsigned().references('id').inTable('users');
  table.bigInteger('modified_by').unsigned().references('id').inTable('users');
}
