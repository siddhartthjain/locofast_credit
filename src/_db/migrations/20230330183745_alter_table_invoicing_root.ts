import * as Knex from "knex";
import { commonFields } from "../helper";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('invoicing_root', (table)=>
    {
       commonFields(knex, table)
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('invoicing_root', table => {
        table.dropColumns('created_on', 'modified_on', 'created_by', 'modified_by');
      });
}

