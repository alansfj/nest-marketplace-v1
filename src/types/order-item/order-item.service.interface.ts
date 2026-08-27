import { OrderItem } from 'src/entities/order-item.entity';
import { Order } from 'src/entities/order.entity';
import { Product } from 'src/entities/product.entity';

export abstract class IOrderItemService {
  abstract addItemToOrder(
    order: Order,
    product: Product,
    productQuantity: number,
  ): Promise<OrderItem[]>;
}
