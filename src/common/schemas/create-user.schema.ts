import { z } from 'zod';
import { nonEmptyStringSchema } from './not-empty-string.schema';

export const createUserSchema = z.object({
  firstName: nonEmptyStringSchema(),
  lastName: nonEmptyStringSchema(),
  email: nonEmptyStringSchema().email(),
  password: nonEmptyStringSchema(),
});
