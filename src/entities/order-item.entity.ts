import { z } from 'zod';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Currency } from '../types/currency.type';
import { validateNewEntity } from 'src/common/utils/validate-new-entity';
import { SelectableColumns } from 'src/types/selectable-columns.type';
import { MONEY_SCALE } from 'src/common/constants/money-scale';
import { Order } from './order.entity';
import { Product } from './product.entity';
import { nonEmptyStringSchema } from 'src/common/schemas/not-empty-string.schema';

const newEntitySchema = z.object({
  order: z.object({
    __brand: z.literal('Order'),
    id: z.number().int().positive(),
  }),
  product: z.object({
    __brand: z.literal('Product'),
    id: z.number().int().positive(),
  }),
  productName: nonEmptyStringSchema(),
  price: z.number().gt(0),
  quantity: z.number().int().positive(),
  currency: z.nativeEnum(Currency),
  subtotalAmount: z.number().positive(),
  totalAmount: z.number().positive(),
});

type newEntityDto = Required<z.infer<typeof newEntitySchema>>;

export type ProductSelectableColumns = SelectableColumns<OrderItem>;

export const TABLE_NAME_ORDER = 'order_items';

export const TABLE_ALIAS_PRODUCT: Uppercase<typeof TABLE_NAME_ORDER> =
  'ORDER_ITEMS';

@Entity(TABLE_NAME_ORDER)
export class OrderItem {
  @Exclude()
  readonly __brand = 'OrderItem';

  private constructor(dto: newEntityDto) {
    Object.assign(this, dto);
  }

  @PrimaryGeneratedColumn()
  readonly id: number;

  @ManyToOne(() => Order, (order) => order.orderItems, {
    nullable: false,
  })
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderItems, {
    nullable: false,
  })
  product: Product;

  @Column({ length: 150, nullable: false })
  productName: string;

  @Column({
    type: 'numeric',
    precision: 11,
    scale: MONEY_SCALE,
    nullable: false,
  })
  price: string;

  @Column()
  quantity: number;

  @Column({
    type: 'enum',
    enum: Currency,
    default: Currency.MXN,
  })
  currency: string;

  @Column({
    type: 'numeric',
    precision: 11,
    scale: MONEY_SCALE,
    nullable: false,
  })
  subtotalAmount: string;

  @Column({
    type: 'numeric',
    precision: 11,
    scale: MONEY_SCALE,
    nullable: false,
  })
  totalAmount: string;

  @CreateDateColumn()
  readonly createdDate: Date;

  @UpdateDateColumn()
  readonly updatedDate: Date;

  @DeleteDateColumn()
  readonly deletedDate: Date;

  // methods

  static create(dto: newEntityDto): OrderItem {
    validateNewEntity('OrderItem', newEntitySchema, dto);

    return new OrderItem(dto);
  }
}
