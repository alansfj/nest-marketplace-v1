import { z } from 'zod';
import { nonEmptyStringSchema } from './not-empty-string.schema';
import { Currency } from 'src/types/currency.type';

export const createProductSchema = z.object({
  name: nonEmptyStringSchema(),
  description: nonEmptyStringSchema(),
  store: z.number().int().positive(),
  subcategory: z.number().int().positive(),
  price: z.number().gt(0),
  currency: z.nativeEnum(Currency),
  quantity: z.number().int().positive(),
});
