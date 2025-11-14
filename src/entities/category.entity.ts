import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Subcategory } from './subcategory.entity';
import { Store } from './store.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  name: string;

  @OneToMany(() => Subcategory, (subcategory) => subcategory.category, {
    nullable: false,
  })
  subcategories: Subcategory[];

  @ManyToMany(() => Store, (store) => store.categories)
  stores: Store[];
}
