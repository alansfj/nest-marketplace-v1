import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';

import { SelectableColumns } from './selectable-columns.type';

export abstract class IBaseTypeormRepository<
  TEntity extends ObjectLiteral,
  TSelectableColumns extends SelectableColumns<TEntity>,
> {
  protected abstract readonly alias: string;
  protected abstract readonly repo: Repository<TEntity>;

  protected abstract qb(): SelectQueryBuilder<TEntity>;

  protected abstract qbSelectedColumns(
    select?: TSelectableColumns[],
  ): SelectQueryBuilder<TEntity>;

  protected abstract save(entity: TEntity): Promise<TEntity>;

  protected abstract findOneById(
    qb: SelectQueryBuilder<TEntity>,
    id: number,
  ): Promise<TEntity | null>;

  protected abstract findManyByIds(
    qb: SelectQueryBuilder<TEntity>,
    ids: number[],
  ): Promise<TEntity[]>;

  protected abstract findAll(
    qb: SelectQueryBuilder<TEntity>,
  ): Promise<TEntity[]>;
}
