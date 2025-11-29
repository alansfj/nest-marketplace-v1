import { Module } from '@nestjs/common';
import { IUserBalanceRepository } from 'src/types/user-balance/user-balance.repository.interface';
import { UserBalanceTypeormRepository } from './user-balance.repository';
import { IUserBalanceService } from 'src/types/user-balance/user-balance.service.interface';
import { UserBalanceService } from './user-balance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBalance } from 'src/entities/user-balance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserBalance])],
  controllers: [],
  providers: [
    {
      provide: IUserBalanceService,
      useClass: UserBalanceService,
    },
    {
      provide: IUserBalanceRepository,
      useClass: UserBalanceTypeormRepository,
    },
  ],
  exports: [IUserBalanceService],
})
export class UserBalanceModule {}
