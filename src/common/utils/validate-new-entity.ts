import { z, ZodSchema } from 'zod';

import { NewEntityError } from 'src/types/create-entity-result.type';

export function validateNewEntity<S extends ZodSchema<any>>(
  schema: S,
  dto: Required<z.infer<S>>,
): NewEntityError | null {
  const result = schema.safeParse(dto);

  if (result.success) return null;

  const message = result.error.errors.map(
    (e) => `${e.path.join('.')}: ${e.message}`,
  );

  return { value: null, errors: message };
}
