import { z } from 'zod';
import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Store } from './store.entity';
import { Product } from './product.entity';
import { UserBalance } from './user-balance.entity';
import { nonEmptyStringSchema } from '../common/schemas/not-empty-string.schema';
import { NewEntityResult } from '../types/create-entity-result.type';

const createUserEntitySchema = z.object({
  firstName: nonEmptyStringSchema(),
  lastName: nonEmptyStringSchema(),
  email: nonEmptyStringSchema().email(),
  password: nonEmptyStringSchema(),
});

type createUserEntityType = Required<z.infer<typeof createUserEntitySchema>>;

@Entity('users')
export class User {
  @Exclude()
  readonly __brand = 'User';

  private constructor(dto: createUserEntityType) {
    Object.assign(this, dto);
  }

  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 50 })
  firstName: string;

  @Column({ length: 50 })
  lastName: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => Store, (store) => store.user)
  stores: Store[];

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @CreateDateColumn()
  readonly createdDate: Date;

  @UpdateDateColumn()
  readonly updatedDate: Date;

  @DeleteDateColumn()
  readonly deletedDate: Date;

  @OneToOne(() => UserBalance, (userBalance) => userBalance.user)
  userBalance: UserBalance;

  // methods

  static create(dto: createUserEntityType): NewEntityResult<User> {
    const result = createUserEntitySchema.safeParse(dto);

    if (!result.success) {
      const message = result.error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join(', ');

      return { value: null, error: message };
    }

    return { value: new User(dto), error: null };
  }
}
