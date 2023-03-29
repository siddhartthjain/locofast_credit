import { Transaction } from 'knex';

export interface RepositoryContract {
  model: any;

  /**
   * Get all rows
   */
  all(inputs?: Record<string, any>): Promise<Array<Record<string, any>> | []>;

  /**
   * Get first instance with the matching criterias
   * @param inputs
   * @param error
   */
  firstWhere(
    inputs: Record<string, any>,
    error?: boolean,
  ): Promise<Record<string, any> | null>;

  /**
   * Get all instances with the matching criterias
   * @param inputs
   * @param error
   */
  getWhere(
    inputs: Record<string, any>,
    error?: boolean,
  ): Promise<Array<Record<string, any>> | []>;

  /**
   * Create a new model with given inputs
   * @param inputs
   */
  create(inputs: Record<string, any>): Promise<Record<string, any>>;

  /**
   * Update or Create model with given condition and values
   * @param conditions
   * @param values
   */
  createOrUpdate(
    conditions: Record<string, any>,
    values: Record<string, any>,
  ): Promise<Record<string, any>>;

  /**
   * Update the given model with values
   * @param model
   * @param setValues
   */
  update(
    model: any,
    setValues: Record<string, any>,
    transaction?: Transaction,
  ): Promise<number | null>;

  /**
   * Check if any model exists where condition is matched
   * @param params
   */
  exists(params: Record<string, any>): Promise<boolean>;

  /**
   * Get count of rows matching a criteria
   * @param params
   */
  count(params: Record<string, any>): Promise<number>;

  /**
   * Refresh a model
   *
   * @param model
   */
  refresh(model): Promise<Record<string, any> | null>;

  /**
   * Returns new Query Builder Instance
   */
  query(arg?: any): any;
}
