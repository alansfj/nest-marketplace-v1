import { z } from 'zod';

import { nonEmptyStringSchema } from './not-empty-string.schema';

export const validateStoreNameSchema = z.object({
  name: nonEmptyStringSchema(),
});
