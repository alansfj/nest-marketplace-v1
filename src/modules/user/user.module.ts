import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { UserTypeormRepository } from './user.repository';
import { IUserRepository } from 'src/types/user/user.repository.interface';
import { IUserService } from 'src/types/user/user.service.interface';
import { UserBalanceModule } from '../user-balance/user-balance.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UserBalanceModule],
  controllers: [UserController],
  providers: [
    {
      provide: IUserService,
      useClass: UserService,
    },
    {
      provide: IUserRepository,
      useClass: UserTypeormRepository,
    },
  ],
  exports: [IUserService],
})
export class UserModule {}
