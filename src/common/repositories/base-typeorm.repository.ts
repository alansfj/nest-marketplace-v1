import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';

import {
  PrimitiveColumns,
  SelectableColumns,
} from 'src/types/selectable-columns.type';
import { IBaseTypeormRepository } from 'src/types/base-typeorm.repository.interface';

export class BaseTypeormRepository<
  TEntity extends ObjectLiteral,
> extends IBaseTypeormRepository<TEntity> {
  protected readonly alias: string;

  constructor(protected readonly repo: Repository<TEntity>) {
    super();
  }

  protected qb() {
    return this.repo.createQueryBuilder(this.alias);
  }

  protected qbSelectedColumns(select: SelectableColumns<TEntity>[]) {
    const qb = this.qb();

    if (!select || !select.length) {
      qb.select(this.alias);
    } else {
      qb.select(select.map((col) => `${this.alias}.${col}`));
    }

    return qb;
  }

  async save(entity: TEntity): Promise<TEntity> {
    return await this.repo.save(entity);
  }

  // exist

  async existsById(id: number): Promise<boolean> {
    const exist = await this.findOneByIdReadOnly(id, [
      'id',
    ] as SelectableColumns<TEntity>[]);

    return !!exist;
  }

  async existsByEqual(
    options: Partial<Record<SelectableColumns<TEntity>, PrimitiveColumns>>,
  ): Promise<boolean> {
    const exists = await this.findOneByEqualReadOnly(options, [
      'id',
    ] as SelectableColumns<TEntity>[]);

    return !!exists;
  }

  // findOneById

  protected findOneById(
    qb: SelectQueryBuilder<TEntity>,
    id: number,
  ): Promise<TEntity | null> {
    return qb.where(`${this.alias}.id = :id`, { id }).getOne();
  }

  async findOneByIdForUpdate(id: number): Promise<TEntity | null> {
    const qb = this.qb().setLock('pessimistic_write');
    return this.findOneById(qb, id);
  }

  async findOneByIdReadOnly<T extends SelectableColumns<TEntity>>(
    id: number,
    select: T[],
  ): Promise<Pick<TEntity, T> | null> {
    const qb = this.qbSelectedColumns(select);
    return this.findOneById(qb, id);
  }

  // findAll

  protected findAll(qb: SelectQueryBuilder<TEntity>): Promise<TEntity[]> {
    return qb.getMany();
  }

  async findAllForUpdate(): Promise<TEntity[]> {
    const qb = this.qb().setLock('pessimistic_write');
    return this.findAll(qb);
  }

  async findAllReadOnly<T extends SelectableColumns<TEntity>>(
    select: T[],
  ): Promise<Pick<TEntity, T>[]> {
    const qb = this.qbSelectedColumns(select);
    return await this.findAll(qb);
  }

  // findManyByIds

  protected findManyByIds(
    qb: SelectQueryBuilder<TEntity>,
    ids: number[],
  ): Promise<TEntity[]> {
    return qb.where(`${this.alias}.id IN (:...ids)`, { ids }).getMany();
  }

  async findManyByIdsForUpdate(ids: number[]): Promise<TEntity[]> {
    const qb = this.qb().setLock('pessimistic_write');
    return await this.findManyByIds(qb, ids);
  }

  async findManyByIdsReadOnly<T extends SelectableColumns<TEntity>>(
    ids: number[],
    select: T[],
  ): Promise<Pick<TEntity, T>[]> {
    const qb = this.qbSelectedColumns(select);
    return this.findManyByIds(qb, ids);
  }

  // findOneByEqual

  protected findOneByEqual(
    qb: SelectQueryBuilder<TEntity>,
    options: Partial<Record<SelectableColumns<TEntity>, PrimitiveColumns>>,
  ): Promise<TEntity | null> {
    Object.entries(options).forEach(([key, value]) => {
      qb.andWhere(`${this.alias}.${key} = :${key}`, { [key]: value });
    });

    return qb.getOne();
  }

  async findOneByEqualForUpdate(
    options: Partial<Record<SelectableColumns<TEntity>, PrimitiveColumns>>,
  ): Promise<TEntity | null> {
    const qb = this.qb().setLock('pessimistic_write');

    return await this.findOneByEqual(qb, options);
  }

  async findOneByEqualReadOnly<T extends SelectableColumns<TEntity>>(
    options: Partial<Record<SelectableColumns<TEntity>, PrimitiveColumns>>,
    select: T[],
  ): Promise<Pick<TEntity, T> | null> {
    const qb = this.qbSelectedColumns(select);

    return await this.findOneByEqual(qb, options);
  }

  // findManyByEqual

  protected findManyByEqual(
    qb: SelectQueryBuilder<TEntity>,
    options: Partial<Record<SelectableColumns<TEntity>, PrimitiveColumns>>,
  ): Promise<TEntity[]> {
    Object.entries(options).forEach(([key, value]) => {
      qb.andWhere(`${this.alias}.${key} = :${key}`, { [key]: value });
    });

    return qb.getMany();
  }

  async findManyByEqualForUpdate(
    options: Partial<Record<SelectableColumns<TEntity>, PrimitiveColumns>>,
  ): Promise<TEntity[]> {
    const qb = this.qb().setLock('pessimistic_write');

    return await this.findManyByEqual(qb, options);
  }

  async findManyByEqualReadOnly<T extends SelectableColumns<TEntity>>(
    options: Partial<Record<SelectableColumns<TEntity>, PrimitiveColumns>>,
    select: T[],
  ): Promise<Pick<TEntity, T>[]> {
    const qb = this.qbSelectedColumns(select);

    return await this.findManyByEqual(qb, options);
  }
}
