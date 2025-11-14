import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Product } from './product.entity';

@Entity('subcategories')
export class Subcategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  name: string;

  @ManyToOne(() => Category, (category) => category.subcategories, {
    nullable: false,
  })
  category: Category;

  @OneToMany(() => Product, (product) => product.subcategory)
  products: Product[];
}
