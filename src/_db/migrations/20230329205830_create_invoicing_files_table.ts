import * as Knex from 'knex';
import { id, commonFields } from '../helper';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('invoicing_files', (table) => {
    id(table), table.string('title');
    table.string('name');
    table
      .bigInteger('org_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('invoicing_root');
    table
      .specificType('file_type', 'TINYINT')
      .unsigned()
      .notNullable()
      .comment('1-Image, 2-Spreadsheet, 3-Pdf, 4-Video, 5-Doc');
    table.string('mime_type');
    table.string('url');
    commonFields(knex, table);
    table
      .specificType('is_deleted', 'TINYINT(1)')
      .unsigned()
      .notNullable()
      .defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('invoicing_files');
}
