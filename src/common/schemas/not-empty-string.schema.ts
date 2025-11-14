import { z } from 'zod';

export const nonEmptyString = (fieldName: string) =>
  z
    .string({
      required_error: `${fieldName} is required`,
      invalid_type_error: `${fieldName} must be a string`,
    })
    .trim()
    .min(1, { message: `${fieldName} cannot be blank` });
