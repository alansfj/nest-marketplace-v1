import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class OrderItemDtoOutput {
  @Expose()
  id: number;

  @Expose()
  productName: string;

  @Expose()
  price: string;

  @Expose()
  quantity: number;

  @Expose()
  currency: string;

  @Expose()
  subtotalAmount: string;

  @Expose()
  totalAmount: string;
}
