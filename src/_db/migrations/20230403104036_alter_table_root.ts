import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('invoicing_root', table =>
    {
        table.integer("is_active").defaultTo(1).after('secret_key');
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('invoicing_root', table=>
    {
        table.dropColumn('is_active');
    })
}

