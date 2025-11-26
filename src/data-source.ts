import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

import { User } from './entities/user.entity';
import { Store } from './entities/store.entity';
import { Category } from './entities/category.entity';
import { Subcategory } from './entities/subcategory.entity';
import { Product } from './entities/product.entity';
import { UserBalance } from './entities/user-balance.entity';

config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [User, Store, Product, Category, Subcategory, UserBalance],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
};

const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;
