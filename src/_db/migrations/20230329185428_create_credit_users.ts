// import { table } from "console";
import * as Knex from "knex";
import { commonFields, id } from "../helper";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('invoicing_users', table=>{
        id(table);
        table.integer("user_id")
    
        table.integer('brandId');  
        table.string("first_name");
        table.string("last_name");
        table.string("userSecretKey");


        commonFields(knex, table);
        
    })
}


export async function down(knex: Knex): Promise<void> {
    knex.schema.dropSchemaIfExists('invoicing_users');
}

