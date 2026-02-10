import { Injectable } from '@nestjs/common';
import { IOrderItemRepository } from 'src/types/order-item/order-item.repository.interface';
import { IOrderItemService } from 'src/types/order-item/order-item.service.interface';

@Injectable()
export class OrderItemService implements IOrderItemService {
  constructor(private readonly orderItemRepository: IOrderItemRepository) {}
}
