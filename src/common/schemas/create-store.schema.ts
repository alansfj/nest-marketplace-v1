import { z } from 'zod';
import { nonEmptyStringSchema } from './not-empty-string.schema';

export const createStoreSchema = z.object({
  name: nonEmptyStringSchema(),
  description: nonEmptyStringSchema(),
  categories: z.array(z.number().int()),
});
