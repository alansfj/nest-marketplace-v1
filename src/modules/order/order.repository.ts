import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order, TABLE_ALIAS_ORDER } from 'src/entities/order.entity';
import { BaseTypeormRepository } from 'src/common/repositories/base-typeorm.repository';
import { IOrderRepository } from 'src/types/order/order.repository.interface';

@Injectable()
export class OrderTypeormRepository
  extends BaseTypeormRepository<Order>
  implements IOrderRepository
{
  protected readonly alias = TABLE_ALIAS_ORDER;

  constructor(
    @InjectRepository(Order)
    repo: Repository<Order>,
  ) {
    super(repo);
  }
}
