import { Exclude, Expose } from 'class-transformer';

import { Currency } from 'src/types/currency.type';

@Exclude()
export class IncreaseUserBalanceDtoOutput {
  @Expose()
  id: number;

  @Expose()
  balance: string;

  @Expose()
  currency: Currency;
}
