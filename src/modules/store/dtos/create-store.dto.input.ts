import { createStoreSchema } from 'src/common/schemas/create-store.schema';
import { z } from 'zod';

export type CreateStoreDtoInput = Required<z.infer<typeof createStoreSchema>>;
