import { CustomQueryBuilder } from '../QueryBuilder';
import { RepositoryContract } from './Contract';
import { Transaction } from 'knex';
import { isEmpty } from '@libs/core/helpers';
import { ModelNotFoundException } from '@libs/core/exceptions';

export class DatabaseRepository implements RepositoryContract {
  model: any;

  async all(): Promise<Array<Record<string, any>> | []> {
    return await this.query();
  }

  async firstWhere(
    inputs?: Record<string, any>,
    error = true,
  ): Promise<Record<string, any> | null> {
    inputs = inputs || {};
    const query = this.query();
    const model = await query.findOne(inputs);

    if (error && isEmpty(model)) this.raiseError();

    return model;
  }

  async getWhere(
    inputs: Record<string, any>,
    error = true,
  ): Promise<Array<Record<string, any>> | []> {
    const query = this.query();

    for (const key in inputs) {
      Array.isArray(inputs[key])
        ? query.whereIn(key, inputs[key])
        : query.where(key, inputs[key]);
    }
    const models = await query;
    if (error && isEmpty(models)) this.raiseError();

    return models;
  }

  async create(inputs: Record<string, any>): Promise<Record<string, any>> {
    if (inputs.length > 1) {
      return await this.query().insertGraph(inputs);
    }
    return await this.query().insertAndFetch(inputs);
  }

  async createOrUpdate(
    conditions: Record<string, any>,
    values: Record<string, any>,
  ): Promise<Record<string, any>> {
    const model = await this.firstWhere(conditions, false);
    if (!model) {
      return this.create({ ...conditions, ...values });
    }

    await this.update(model, values);
    return await this.refresh(model);
  }

  async exists(params: Record<string, any>): Promise<boolean> {
    const query = this.query();
    query.where(params);
    return !!(await query.onlyCount());
  }

  async count(params): Promise<number> {
    const query = this.query();
    query.where(params);
    return await query.onlyCount();
  }

  async refresh(model): Promise<Record<string, any> | null> {
    return model ? await this.query().findById(model.id) : null;
  }

  async update(
    model: Record<string, any>,
    setValues: Record<string, any>,
    trx?: Transaction,
  ): Promise<number | null> {
    const query = this.query();
    query.findById(model.id).patch(setValues).context({ id: model.id });
    return await query;
  }

  /**
   * Throws model not found exception.
   *
   * @throws ModelNotFoundException
   */
  raiseError(): void {
    throw new ModelNotFoundException(this.getEntityName() + ' not found');
  }

  /**
   * Returns new Query Builder Instance
   */
  query(arg?: any): CustomQueryBuilder<any, any> {
    return this.model.query(arg);
  }

  getEntityName(): string {
    return this.model.name;
  }
}
