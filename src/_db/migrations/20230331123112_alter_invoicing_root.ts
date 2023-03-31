import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('invoicing_root', table=>
    {
        table.string("GST").notNullable().after('name');
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('invoicing_root', table=>
    {
        table.dropColumn("GST");
    })
}

