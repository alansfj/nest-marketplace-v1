import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { Store } from 'src/entities/store.entity';
import { IStoreService } from 'src/types/store/store.service.interface';
import { IStoreRepository } from 'src/types/store/store.repository.interface';
import { StoreTypeormRepository } from './store.repository';
import { CategoryModules } from '../category/category.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Store]), CategoryModules, UserModule],
  controllers: [StoreController],
  providers: [
    {
      provide: IStoreService,
      useClass: StoreService,
    },
    {
      provide: IStoreRepository,
      useClass: StoreTypeormRepository,
    },
  ],
  exports: [IStoreService],
})
export class StoreModule {}
