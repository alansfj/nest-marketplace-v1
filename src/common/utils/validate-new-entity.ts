import { z, ZodSchema } from 'zod';

import { EntityValidationException } from '../exceptions/entity-validation.exception';

export function validateNewEntity<S extends ZodSchema<any>>(
  entityName: string,
  schema: S,
  dto: Required<z.infer<S>>,
): void {
  const result = schema.safeParse(dto);

  if (result.success) return;

  const message = result.error.errors.map(
    (e) => `${e.path.join('.')}: ${e.message}`,
  );

  throw new EntityValidationException(entityName, message);
}
