import { z } from 'zod';
import { createUserSchema } from 'src/common/schemas/create-user.schema';

export type RegisterDtoInput = Required<z.infer<typeof createUserSchema>>;
