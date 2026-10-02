import { z } from 'zod';
import { listProductsSchema } from 'src/common/schemas/list-products.schema';

export type ListProductsDtoInput = Required<z.infer<typeof listProductsSchema>>;
