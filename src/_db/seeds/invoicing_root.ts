import * as Knex from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('invoicing_root').del();

  // Inserts seed entries
  await knex('invoicing_root').insert([
    {
      id: 1,
      brandId: 1200,
      name: 'AKS Fabric Export',
      brandtype: 1,
      isCreditAvailable: true,
      gst: '24AAAFL8391H1Z7',
      creditPeriod: 30,
      creditCharges: 2,
      createdBy: 1054,
      modifiedBy: 1054,
    },
  ]);
}
