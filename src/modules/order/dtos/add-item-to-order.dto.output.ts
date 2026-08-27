import { Exclude, Expose, Type } from 'class-transformer';

import { OrderItemDtoOutput } from 'src/modules/order-item/dtos/order-item.dto.output';

@Exclude()
export class AddItemToOrderDtoOutput {
  @Expose()
  id: number;

  @Expose()
  status: string;

  @Expose()
  subtotalAmount: string;

  @Expose()
  totalAmount: string;

  @Expose()
  currency: string;

  @Expose()
  createdDate: Date;

  @Expose()
  @Type(() => OrderItemDtoOutput)
  orderItems: OrderItemDtoOutput[];
}
