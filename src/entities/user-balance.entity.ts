import { z } from 'zod';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from './user.entity';
import { Currency } from '../types/currency.type';
import { NewEntityResult } from 'src/types/create-entity-result.type';
import { validateNewEntity } from 'src/common/utils/validate-new-entity';
import { SelectableColumns } from 'src/types/selectable-columns.type';

const newEntitySchema = z.object({
  user: z.object({
    __brand: z.literal('User'),
  }),
  balance: z.number().gte(0),
  currency: z.nativeEnum(Currency),
});

type newEntityDto = Required<z.infer<typeof newEntitySchema>>;

export type UserBalanceSelectableColumns = SelectableColumns<UserBalance>;

export const TABLE_NAME_USER_BALANCE = 'user_balance';

export const TABLE_ALIAS_USER_BALANCE: Uppercase<
  typeof TABLE_NAME_USER_BALANCE
> = 'USER_BALANCE';

@Entity(TABLE_NAME_USER_BALANCE)
export class UserBalance {
  @Exclude()
  readonly __brand = 'UserBalance';

  private constructor(dto: newEntityDto) {
    Object.assign(this, dto);
  }

  @PrimaryGeneratedColumn()
  readonly id: number;

  @OneToOne(() => User, { nullable: false })
  @JoinColumn()
  user: User;

  @Column({
    type: 'numeric',
    precision: 11,
    scale: 2,
    nullable: false,
    default: 0,
  })
  balance: number;

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

  // methods

  static create(dto: newEntityDto): NewEntityResult<UserBalance> {
    const newEntityError = validateNewEntity(newEntitySchema, dto);

    if (newEntityError) return newEntityError;

    return { value: new UserBalance(dto), errors: null };
  }
}
