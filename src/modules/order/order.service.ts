import { BadRequestException, Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

import { Order } from 'src/entities/order.entity';
import { IOrderRepository } from 'src/types/order/order.repository.interface';
import { IOrderService } from 'src/types/order/order.service.interface';
import { AddItemToOrderDtoInput } from './dtos/add-item-to-order.dto.input';
import { IUserService } from 'src/types/user/user.service.interface';
import { IProductService } from 'src/types/product/product.service.interface';
import { OrderStatus } from 'src/types/order-status.type';
import { Money } from 'src/common/value-objects/money';

@Injectable()
export class OrderService implements IOrderService {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly userService: IUserService,
    private readonly productService: IProductService,
  ) {}

  @Transactional()
  async addItemToOrder(
    userId: number,
    dto: AddItemToOrderDtoInput,
  ): Promise<Order> {
    const [user, product] = await Promise.all([
      this.userService.getUserFromId(userId),
      this.productService.getProductByIdWithOwner(dto.productId),
    ]);

    if (product.user.id === user.id) {
      throw new BadRequestException(
        'You cannot add products of your own to your cart',
      );
    }

    if (product.quantity < dto.productQuantity) {
      throw new BadRequestException(
        'There is not sufficient stock of this product',
      );
    }

    let order = await this.orderRepository.findOneByUserIdWithStatusCart(
      user.id,
    );

    if (!order) {
      const subtotalAmount = Money.from(product.price)
        .multiply(dto.productQuantity)
        .toNumber();

      const newOrderEntity = Order.create({
        status: OrderStatus.CART,
        currency: product.currency,
        subtotalAmount,
        totalAmount: subtotalAmount,
        user,
      });

      order = await this.orderRepository.save(newOrderEntity);
    }

    return order;
  }
}
