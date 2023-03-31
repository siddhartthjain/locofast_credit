import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('invoicing_root', table =>
    {
        table.dropColumns('is_credit_available', 'credit_period', 'credit_charges');
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('invoicing_root', table=>
    {
        table.boolean('is_credit_available').defaultTo(1);
        table
          .specificType('credit_period', 'TINYINT(2)')
          .notNullable()
          .defaultTo(30);
        table.integer('credit_charges').notNullable().defaultTo(2); 
    });
}

