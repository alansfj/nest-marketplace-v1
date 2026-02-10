import { Injectable } from '@nestjs/common';
import { IOrderRepository } from 'src/types/order/order.repository.interface';
import { IOrderService } from 'src/types/order/order.service.interface';

@Injectable()
export class OrderService implements IOrderService {
  constructor(private readonly orderRepository: IOrderRepository) {}
}
