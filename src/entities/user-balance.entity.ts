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

@Entity('user_balance')
export class UserBalance {
  @PrimaryGeneratedColumn()
  id: number;

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
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;
}
