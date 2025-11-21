import { User } from 'src/entities/user.entity';

export interface IUserRepository {
  create(data: Partial<User>): User;

  save(user: User): Promise<User>;

  findOneById(id: number): Promise<User | null>;

  findOneByEmail(email: string): Promise<User | null>;

  findOneBy(options: Partial<User>): Promise<User | null>;
}
