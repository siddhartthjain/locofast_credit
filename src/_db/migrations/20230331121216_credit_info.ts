import * as Knex from "knex";
import { id } from "../helper";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("credit_info", table =>
    {
       id(table);
       table.bigInteger('customer_id')
       .unsigned()
       .notNullable()
       .references('id')
       .inTable('invoicing_root');
       table.integer('credit').notNullable().defaultTo(2);
       table.integer('is_credit_available').notNullable().defaultTo(1);
       table.integer('credit_period').notNullable(); 
    })
}


export async function down(knex: Knex): Promise<void> {
}

