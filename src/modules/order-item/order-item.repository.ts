import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  OrderItem,
  TABLE_ALIAS_ORDER_ITEM,
} from 'src/entities/order-item.entity';
import { BaseTypeormRepository } from 'src/common/repositories/base-typeorm.repository';
import { IOrderItemRepository } from 'src/types/order-item/order-item.repository.interface';

@Injectable()
export class OrderItemTypeormRepository
  extends BaseTypeormRepository<OrderItem>
  implements IOrderItemRepository
{
  protected readonly alias = TABLE_ALIAS_ORDER_ITEM;

  constructor(
    @InjectRepository(OrderItem)
    repo: Repository<OrderItem>,
  ) {
    super(repo);
  }
}
