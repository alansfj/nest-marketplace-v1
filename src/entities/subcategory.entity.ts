import { z } from 'zod';
import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Category } from './category.entity';
import { Product } from './product.entity';
import { nonEmptyStringSchema } from 'src/common/schemas/not-empty-string.schema';
import { NewEntityResult } from 'src/types/create-entity-result.type';
import { validateNewEntity } from 'src/common/utils/validate-new-entity';
import { SelectableColumns } from 'src/types/selectable-columns.type';

const newEntitySchema = z.object({
  category: z.object({
    __brand: z.literal('Category'),
  }),
  name: nonEmptyStringSchema(),
});

type newEntityDto = Required<z.infer<typeof newEntitySchema>>;

export type SubcategorySelectableColumns = SelectableColumns<Subcategory>;

@Entity('subcategories')
export class Subcategory {
  @Exclude()
  readonly __brand = 'Subcategory';

  private constructor(dto: newEntityDto) {
    Object.assign(this, dto);
  }

  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ unique: true, length: 50 })
  name: string;

  @ManyToOne(() => Category, (category) => category.subcategories, {
    nullable: false,
  })
  category: Category;

  @OneToMany(() => Product, (product) => product.subcategory)
  products: Product[];

  // methods

  static create(dto: newEntityDto): NewEntityResult<Subcategory> {
    const newEntityError = validateNewEntity(newEntitySchema, dto);

    if (newEntityError) return newEntityError;

    return { value: new Subcategory(dto), errors: null };
  }
}
