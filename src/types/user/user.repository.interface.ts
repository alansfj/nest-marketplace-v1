import { User } from 'src/entities/user.entity';
import { IBaseTypeormRepository } from '../base-typeorm.repository.interface';

export abstract class IUserRepository extends IBaseTypeormRepository<User> {}
