import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderItemController } from './order-item.controller';
import { OrderItem } from 'src/entities/order-item.entity';
import { IOrderItemService } from 'src/types/order-item/order-item.service.interface';
import { OrderItemService } from './order-item.service';
import { IOrderItemRepository } from 'src/types/order-item/order-item.repository.interface';
import { OrderItemTypeormRepository } from './order-item.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem])],
  controllers: [OrderItemController],
  providers: [
    {
      provide: IOrderItemService,
      useClass: OrderItemService,
    },
    {
      provide: IOrderItemRepository,
      useClass: OrderItemTypeormRepository,
    },
  ],
  exports: [IOrderItemService],
})
export class OrderItemModule {}
