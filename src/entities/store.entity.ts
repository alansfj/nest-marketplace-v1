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

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

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
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;
}
