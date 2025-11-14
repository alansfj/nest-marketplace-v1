import { z } from 'zod';
import { nonEmptyString } from './not-empty-string.schema';

export const createUserSchema = z.object({
  firstName: nonEmptyString('firstName'),
  lastName: nonEmptyString('lastName'),
  email: nonEmptyString('email').email({ message: 'Invalid email format' }),
  password: nonEmptyString('password'),
});
