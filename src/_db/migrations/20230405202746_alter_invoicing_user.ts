import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('invoicing_users', table=>
    {
        table.string('email').after('last_name');
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("invoicing_users", table=>
    {
        table.dropColumn('email');
    })

}

