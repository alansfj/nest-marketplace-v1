import { z } from 'zod';
import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { User } from './user.entity';
import { Product } from './product.entity';
import { Category } from './category.entity';
import { nonEmptyStringSchema } from 'src/common/schemas/not-empty-string.schema';
import { NewEntityResult } from 'src/types/create-entity-result.type';
import { validateNewEntity } from 'src/common/utils/validate-new-entity';
import { SelectableColumns } from 'src/types/selectable-columns.type';

const newEntitySchema = z.object({
  name: nonEmptyStringSchema(),
  description: nonEmptyStringSchema(),
  user: z.object({
    __brand: z.literal('User'),
  }),
  category: z.object({
    __brand: z.literal('Category'),
  }),
});

type newEntityDto = Required<z.infer<typeof newEntitySchema>>;

export type StoreSelectableColumns = SelectableColumns<Store>;

@Entity('stores')
export class Store {
  @Exclude()
  readonly __brand = 'Store';

  private constructor(dto: newEntityDto) {
    Object.assign(this, dto);
  }

  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ unique: true, length: 100 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => User, (user) => user.stores, { nullable: false })
  user: User;

  @OneToMany(() => Product, (product) => product.store)
  products: Product[];

  @ManyToMany(() => Category, (category) => category.stores)
  @JoinTable()
  categories: Category[];

  @CreateDateColumn()
  readonly createdDate: Date;

  @UpdateDateColumn()
  readonly updatedDate: Date;

  @DeleteDateColumn()
  readonly deletedDate: Date;

  // methods

  static create(dto: newEntityDto): NewEntityResult<Store> {
    const newEntityError = validateNewEntity(newEntitySchema, dto);

    if (newEntityError) return newEntityError;

    return { value: new Store(dto), errors: null };
  }
}
