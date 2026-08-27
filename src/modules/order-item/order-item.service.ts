import { BadRequestException, Injectable } from '@nestjs/common';

import { Money } from 'src/common/value-objects/money';
import { OrderItem } from 'src/entities/order-item.entity';
import { Order } from 'src/entities/order.entity';
import { Product } from 'src/entities/product.entity';
import { IOrderItemRepository } from 'src/types/order-item/order-item.repository.interface';
import { IOrderItemService } from 'src/types/order-item/order-item.service.interface';

@Injectable()
export class OrderItemService implements IOrderItemService {
  constructor(private readonly orderItemRepository: IOrderItemRepository) {}

  async addItemToOrder(
    order: Order,
    product: Product,
    productQuantity: number,
  ): Promise<OrderItem[]> {
    const orderItems =
      await this.orderItemRepository.findManyByOrderIdWithProduct(order.id);

    const orderItem = orderItems.find((item) => item.product.id === product.id);

    if (orderItem) {
      const productsInOrder = orderItem.quantity + productQuantity;

      if (product.quantity < productsInOrder) {
        throw new BadRequestException(
          'There is not sufficient stock of this product',
        );
      }

      const currentPrice = Money.from(product.price);
      const subtotalAmount = currentPrice.multiply(productsInOrder).toString();

      orderItem.price = product.price;
      orderItem.quantity = productsInOrder;
      orderItem.subtotalAmount = subtotalAmount;
      orderItem.totalAmount = subtotalAmount;

      await this.orderItemRepository.save(orderItem);

      return orderItems.map((item) =>
        item.id === orderItem.id ? orderItem : item,
      );
    }

    const productPrice = Money.from(product.price);

    const subtotalAmount = productPrice.multiply(productQuantity).toNumber();

    const newOrderItemEntity = OrderItem.create({
      order,
      product,
      productName: product.name,
      price: productPrice.toNumber(),
      currency: product.currency,
      quantity: productQuantity,
      subtotalAmount,
      totalAmount: subtotalAmount,
    });

    const newOrderItem =
      await this.orderItemRepository.save(newOrderItemEntity);

    orderItems.push(newOrderItem);

    return orderItems;
  }
}
