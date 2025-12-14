import { z } from 'zod';
import { BALANCE_MAX_INCREASE_LIMIT } from '../constants/balance-max-increase-limit';

export const increaseUserBalanceSchema = z.object({
  quantity: z.number().positive().lte(BALANCE_MAX_INCREASE_LIMIT),
});
