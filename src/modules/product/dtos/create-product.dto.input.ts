import { z } from 'zod';
import { createProductSchema } from 'src/common/schemas/create-product.schema';

export type CreateProductDtoInput = Required<
  z.infer<typeof createProductSchema>
>;
