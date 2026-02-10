import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Order } from 'src/entities/order.entity';
import { OrderController } from './order.controller';
import { IOrderService } from 'src/types/order/order.service.interface';
import { OrderService } from './order.service';
import { IOrderRepository } from 'src/types/order/order.repository.interface';
import { OrderTypeormRepository } from './order.repository';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), UserModule, ProductModule],
  controllers: [OrderController],
  providers: [
    {
      provide: IOrderService,
      useClass: OrderService,
    },
    {
      provide: IOrderRepository,
      useClass: OrderTypeormRepository,
    },
  ],
  exports: [IOrderService],
})
export class OrderModule {}
