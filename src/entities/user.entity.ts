import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Store } from './store.entity';
import { Product } from './product.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

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
}
