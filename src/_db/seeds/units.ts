import * as Knex from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('units').del();

  // Inserts seed entries
  await knex('units').insert([
    { id: 1, unit: 'kilograms', shortName: 'kg' },
    { id: 2, unit: 'meters', shortName: 'meter' },
    { id: 3, unit: 'yards', shortName: 'yd' },
    { id: 4, unit: 'pounds', shortName: 'lb' },
  ]);
}
