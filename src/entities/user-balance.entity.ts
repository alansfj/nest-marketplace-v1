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
import { z } from 'zod';
import { NewEntityResult } from 'src/types/create-entity-result.type';
import { Exclude } from 'class-transformer';

const createUserBalanceEntitySchema = z.object({
  user: z.object({
    __brand: z.literal('User'),
  }),
  balance: z.number().gte(0),
  currency: z.nativeEnum(Currency),
});

type createUserBalanceEntityType = Required<
  z.infer<typeof createUserBalanceEntitySchema>
>;

@Entity('user_balance')
export class UserBalance {
  @Exclude()
  readonly __brand = 'UserBalance';

  private constructor(dto: createUserBalanceEntityType) {
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

  static create(
    dto: createUserBalanceEntityType,
  ): NewEntityResult<UserBalance> {
    const result = createUserBalanceEntitySchema.safeParse(dto);

    if (!result.success) {
      const message = result.error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join(', ');

      return { value: null, error: message };
    }

    return { value: new UserBalance(dto), error: null };
  }
}
