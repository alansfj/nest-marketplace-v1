import { z } from 'zod';

export const addItemToOrderSchema = z.object({
  productId: z.number().int().positive(),
  productQuantity: z.number().int().positive(),
});
