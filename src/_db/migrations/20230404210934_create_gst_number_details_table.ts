import * as Knex from 'knex';
import { commonFields, id } from '../helper';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('gst_number_details', (table) => {
    id(table);

    table.string('gst_number').notNullable().index();

    table.string('legal_name').comment('Legal Name of Business');

    table.text('address').comment('Pricipal Place of Business fields');

    table.string('status').comment('GSTN status');

    table.string('trade_name').comment('Trade Name');

    table.string('taxpayer_type').comment('Taxpayer type');

    table.string('business_nature').comment('Nature of Business Activity');

    table.string('business_constitution').comment('Constitution of Business');

    table
      .text('additional_address')
      .comment('Additional Place of Business Fields');

    table.string('state_jurisdiction_code').comment('State Jurisdiction Code');

    table.string('state_jurisdiction').comment('State Jurisdiction');

    table
      .string('centre_jurisdiction_code')
      .comment('Centre Jurisdiction Code');

    table.string('centre_jurisdiction').comment('Centre Jurisdiction');

    table.string('registration_date').comment('Date of Registration');

    table.string('cancellation_date').comment('Date Of Cancellation');

    table.string('last_updated_date').comment('Last Updated Date');

    commonFields(knex, table);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('gst_number_details');
}
