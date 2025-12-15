import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';

import { SelectableColumns } from 'src/types/selectable-columns.type';
import { IBaseTypeormRepository } from 'src/types/base-typeorm.repository.interface';

export class BaseTypeormRepository<
  TEntity extends ObjectLiteral,
  TSelectableColumns extends SelectableColumns<TEntity>,
> extends IBaseTypeormRepository<TEntity, TSelectableColumns> {
  protected readonly alias: string;

  constructor(protected readonly repo: Repository<TEntity>) {
    super();
  }

  protected qb() {
    return this.repo.createQueryBuilder(this.alias);
  }

  protected qbSelectedColumns(select?: TSelectableColumns[]) {
    const qb = this.qb();

    if (!select || !select.length) {
      qb.select(this.alias);
    } else {
      qb.select(select.map((col) => `${this.alias}.${col}`));
    }

    return qb;
  }

  protected async save(entity: TEntity): Promise<TEntity> {
    return await this.repo.save(entity);
  }

  protected findOneById(
    qb: SelectQueryBuilder<TEntity>,
    id: number,
  ): Promise<TEntity | null> {
    return qb.where(`${this.alias}.id = :id`, { id }).getOne();
  }

  protected findManyByIds(
    qb: SelectQueryBuilder<TEntity>,
    ids: number[],
  ): Promise<TEntity[]> {
    return qb.where(`${this.alias}.id IN (:...ids)`, { ids }).getMany();
  }

  protected findAll(qb: SelectQueryBuilder<TEntity>): Promise<TEntity[]> {
    return qb.getMany();
  }
}
