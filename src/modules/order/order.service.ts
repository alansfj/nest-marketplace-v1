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
import { IOrderItemService } from 'src/types/order-item/order-item.service.interface';

@Injectable()
export class OrderService implements IOrderService {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly userService: IUserService,
    private readonly productService: IProductService,
    private readonly orderItemService: IOrderItemService,
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

    if (order && order.currency !== product.currency) {
      throw new BadRequestException(
        'This product currency does not match your cart currency',
      );
    }

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

    const orderItems = await this.orderItemService.addItemToOrder(
      order,
      product,
      dto.productQuantity,
    );

    const total = orderItems.reduce(
      (sum, item) => sum.add(Money.from(item.totalAmount)),
      Money.zero(),
    );

    order.subtotalAmount = total.toString();
    order.totalAmount = total.toString();

    order = await this.orderRepository.save(order);

    // Break the order <-> orderItem back-reference so the response
    // interceptor doesn't choke on a circular structure.
    order.orderItems = orderItems.map((item) => ({
      ...item,
      order: undefined as unknown as Order,
    }));

    return order;
  }
}
