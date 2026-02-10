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

import { User } from './user.entity';
import { Currency } from '../types/currency.type';
import { validateNewEntity } from 'src/common/utils/validate-new-entity';
import { SelectableColumns } from 'src/types/selectable-columns.type';
import { MONEY_SCALE } from 'src/common/constants/money-scale';
import { OrderStatus } from 'src/types/order-status.type';
import { OrderItem } from './order-item.entity';

const newEntitySchema = z.object({
  user: z.object({
    __brand: z.literal('User'),
    id: z.number().int().positive(),
  }),
  status: z.nativeEnum(OrderStatus),
  subtotalAmount: z.number().positive(),
  totalAmount: z.number().positive(),
  currency: z.nativeEnum(Currency),
});

type newEntityDto = Required<z.infer<typeof newEntitySchema>>;

export type ProductSelectableColumns = SelectableColumns<Order>;

export const TABLE_NAME_ORDER = 'orders';

export const TABLE_ALIAS_ORDER: Uppercase<typeof TABLE_NAME_ORDER> = 'ORDERS';

@Entity(TABLE_NAME_ORDER)
export class Order {
  @Exclude()
  readonly __brand = 'Order';

  private constructor(dto: newEntityDto) {
    Object.assign(this, dto);
  }

  @PrimaryGeneratedColumn()
  readonly id: number;

  @ManyToOne(() => User, (user) => user.products, {
    nullable: false,
  })
  user: Partial<User>;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.CART,
  })
  status: string;

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

  @Column({
    type: 'enum',
    enum: Currency,
    default: Currency.MXN,
  })
  currency: string;

  @CreateDateColumn()
  readonly createdDate: Date;

  @UpdateDateColumn()
  readonly updatedDate: Date;

  @DeleteDateColumn()
  readonly deletedDate: Date;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];

  // methods

  static create(dto: newEntityDto): Order {
    validateNewEntity('Order', newEntitySchema, dto);

    return new Order(dto);
  }
}
