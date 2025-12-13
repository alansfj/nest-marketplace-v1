import { validateStoreNameSchema } from 'src/common/schemas/validate-store-name.schema';
import { z } from 'zod';

export type ValidateStoreNameDtoInput = Required<
  z.infer<typeof validateStoreNameSchema>
>;
