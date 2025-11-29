import { User } from 'src/entities/user.entity';

export abstract class IUserRepository {
  abstract save(user: User): Promise<User>;

  abstract findOneById(id: number): Promise<User | null>;

  abstract findOneByEmail(email: string): Promise<User | null>;

  abstract findOneBy(options: Partial<User>): Promise<User | null>;
}
