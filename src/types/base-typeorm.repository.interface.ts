import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';

import { SelectableColumns } from './selectable-columns.type';

export abstract class IBaseTypeormRepository<TEntity extends ObjectLiteral> {
  protected abstract readonly alias: string;
  protected abstract readonly repo: Repository<TEntity>;

  protected abstract qb(): SelectQueryBuilder<TEntity>;

  protected abstract qbSelectedColumns(
    select?: SelectableColumns<TEntity>[],
  ): SelectQueryBuilder<TEntity>;

  abstract save(entity: TEntity): Promise<TEntity>;

  // findOneById

  protected abstract findOneById(
    qb: SelectQueryBuilder<TEntity>,
    id: number,
  ): Promise<TEntity | null>;

  abstract findOneByIdForUpdate(id: number): Promise<TEntity | null>;

  abstract findOneByIdReadOnly<T extends SelectableColumns<TEntity>>(
    id: number,
    select: T[],
  ): Promise<Pick<TEntity, T> | null>;

  // findAll

  protected abstract findAll(
    qb: SelectQueryBuilder<TEntity>,
  ): Promise<TEntity[]>;

  abstract findAllForUpdate(): Promise<TEntity[]>;

  abstract findAllReadOnly<T extends SelectableColumns<TEntity>>(
    select: T[],
  ): Promise<Pick<TEntity, T>[]>;

  // findManyByIds

  protected abstract findManyByIds(
    qb: SelectQueryBuilder<TEntity>,
    ids: number[],
  ): Promise<TEntity[]>;

  abstract findManyByIdsForUpdate(ids: number[]): Promise<TEntity[]>;

  abstract findManyByIdsReadOnly<T extends SelectableColumns<TEntity>>(
    ids: number[],
    select: T[],
  ): Promise<Pick<TEntity, T>[]>;
}
