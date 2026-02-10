import { z } from 'zod';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Store } from './store.entity';
import { Subcategory } from './subcategory.entity';
import { User } from './user.entity';
import { Currency } from '../types/currency.type';
import { nonEmptyStringSchema } from 'src/common/schemas/not-empty-string.schema';
import { validateNewEntity } from 'src/common/utils/validate-new-entity';
import { SelectableColumns } from 'src/types/selectable-columns.type';
import { MONEY_SCALE } from 'src/common/constants/money-scale';
import { OrderItem } from './order-item.entity';

const newEntitySchema = z.object({
  name: nonEmptyStringSchema(),
  description: nonEmptyStringSchema(),
  store: z.object({
    __brand: z.literal('Store'),
    id: z.number().int().positive(),
  }),
  user: z.object({
    __brand: z.literal('User'),
    id: z.number().int().positive(),
  }),
  subcategory: z.object({
    __brand: z.literal('Subcategory'),
    id: z.number().int().positive(),
  }),
  price: z.number().gt(0),
  currency: z.nativeEnum(Currency),
  quantity: z.number().int().positive(),
});

type newEntityDto = Required<z.infer<typeof newEntitySchema>>;

export type ProductSelectableColumns = SelectableColumns<Product>;

export const TABLE_NAME_PRODUCT = 'products';

export const TABLE_ALIAS_PRODUCT: Uppercase<typeof TABLE_NAME_PRODUCT> =
  'PRODUCTS';

@Entity(TABLE_NAME_PRODUCT)
export class Product {
  @Exclude()
  readonly __brand = 'Product';

  private constructor(dto: newEntityDto) {
    Object.assign(this, dto);
  }

  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ length: 150, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @ManyToOne(() => Store, (store) => store.products, {
    nullable: false,
  })
  store: Store;

  @ManyToOne(() => Subcategory, (subcategory) => subcategory.products, {
    nullable: false,
  })
  subcategory: Subcategory;

  @Column({
    type: 'numeric',
    precision: 11,
    scale: MONEY_SCALE,
    nullable: false,
  })
  price: string;

  @Column({
    type: 'enum',
    enum: Currency,
    default: Currency.MXN,
  })
  currency: string;

  @Column()
  quantity: number;

  @ManyToOne(() => User, (user) => user.products, {
    nullable: false,
  })
  user: Partial<User>;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @CreateDateColumn()
  readonly createdDate: Date;

  @UpdateDateColumn()
  readonly updatedDate: Date;

  @DeleteDateColumn()
  readonly deletedDate: Date;

  // methods

  static create(dto: newEntityDto): Product {
    validateNewEntity('Product', newEntitySchema, dto);

    return new Product(dto);
  }
}
