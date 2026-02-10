import { Order } from 'src/entities/order.entity';
import { AddItemToOrderDtoInput } from 'src/modules/order/dtos/add-item-to-order.dto.input';

export abstract class IOrderService {
  abstract addItemToOrder(
    userId: number,
    dto: AddItemToOrderDtoInput,
  ): Promise<Order>;
}
