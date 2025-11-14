import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Store } from './store.entity';
import { Subcategory } from './subcategory.entity';
import { User } from './user.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

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
    scale: 2,
    nullable: false,
  })
  price: number;

  @Column()
  currency: string;

  @Column()
  quantity: number;

  @ManyToOne(() => User, (user) => user.products, {
    nullable: false,
  })
  user: Partial<User>;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;
}
