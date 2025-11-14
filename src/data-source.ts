import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

import { User } from './entities/user.entity';

config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [User],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
};

const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;
