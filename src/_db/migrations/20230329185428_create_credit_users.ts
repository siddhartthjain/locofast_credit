// import { table } from "console";
import * as Knex from "knex";
import { commonFields, id } from "../helper";



export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('invoicing_users', table=>{
        id(table);
        table.integer("user_id")
        table.integer('brand_id');  
        table.bigInteger('root_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable("invoicing_root");
        table.string("first_name");
        table.string("last_name");
        table.string("user_secret_key");


        
        
    })
}


export async function down(knex: Knex): Promise<void> {
    knex.schema.dropSchemaIfExists('invoicing_users');
}

