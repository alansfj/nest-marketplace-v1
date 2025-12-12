import { z } from 'zod';
import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Subcategory } from './subcategory.entity';
import { Store } from './store.entity';
import { nonEmptyStringSchema } from 'src/common/schemas/not-empty-string.schema';
import { validateNewEntity } from 'src/common/utils/validate-new-entity';
import { SelectableColumns } from 'src/types/selectable-columns.type';

const newEntitySchema = z.object({
  name: nonEmptyStringSchema(),
});

type newEntityDto = Required<z.infer<typeof newEntitySchema>>;

export type CategorySelectableColumns = SelectableColumns<Category>;

export const TABLE_NAME_CATEGORY = 'categories';

export const TABLE_ALIAS_CATEGORY: Uppercase<typeof TABLE_NAME_CATEGORY> =
  'CATEGORIES';

export const ENTITY_NAME_CATEGORY = 'Category';

@Entity(TABLE_NAME_CATEGORY)
export class Category {
  @Exclude()
  readonly __brand = ENTITY_NAME_CATEGORY;

  private constructor(dto: newEntityDto) {
    Object.assign(this, dto);
  }

  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ unique: true, length: 50 })
  name: string;

  @OneToMany(() => Subcategory, (subcategory) => subcategory.category, {
    nullable: false,
  })
  subcategories: Subcategory[];

  @ManyToMany(() => Store, (store) => store.categories)
  stores: Store[];

  // methods

  static create(dto: newEntityDto): Category {
    validateNewEntity(ENTITY_NAME_CATEGORY, newEntitySchema, dto);

    return new Category(dto);
  }
}
