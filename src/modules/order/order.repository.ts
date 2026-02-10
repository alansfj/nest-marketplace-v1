import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order, TABLE_ALIAS_ORDER } from 'src/entities/order.entity';
import { BaseTypeormRepository } from 'src/common/repositories/base-typeorm.repository';
import { IOrderRepository } from 'src/types/order/order.repository.interface';
import { OrderStatus } from 'src/types/order-status.type';

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

  async findOneByUserIdWithStatusCart(userId: number): Promise<Order | null> {
    return await this.qb()
      .where(`${this.alias}.userId = :userId`, { userId })
      .andWhere(`${this.alias}.status = :status`, { status: OrderStatus.CART })
      .getOne();
  }
}
