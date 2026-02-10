import { Exclude, Expose } from 'class-transformer';

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
}
