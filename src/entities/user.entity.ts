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
import { validateNewEntity } from 'src/common/utils/validate-new-entity';
import { SelectableColumns } from 'src/types/selectable-columns.type';

const newEntitySchema = z.object({
  firstName: nonEmptyStringSchema(),
  lastName: nonEmptyStringSchema(),
  email: nonEmptyStringSchema().email(),
  password: nonEmptyStringSchema(),
});

type newEntityDto = Required<z.infer<typeof newEntitySchema>>;

export type UserSelectableColumns = SelectableColumns<User>;

export const TABLE_NAME_USER = 'users';

export const TABLE_ALIAS_USER: Uppercase<typeof TABLE_NAME_USER> = 'USERS';

export const ENTITY_NAME_USER = 'User';

@Entity(TABLE_NAME_USER)
export class User {
  @Exclude()
  readonly __brand = ENTITY_NAME_USER;

  private constructor(dto: newEntityDto) {
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

  static create(dto: newEntityDto): User {
    validateNewEntity(ENTITY_NAME_USER, newEntitySchema, dto);

    return new User(dto);
  }
}
