import { increaseUserBalanceSchema } from 'src/common/schemas/increase-user-balance.schema';
import { z } from 'zod';

export type IncreaseUserBalanceDtoInput = Required<
  z.infer<typeof increaseUserBalanceSchema>
>;
