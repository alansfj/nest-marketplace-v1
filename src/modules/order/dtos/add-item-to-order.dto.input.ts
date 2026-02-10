import { z } from 'zod';
import { addItemToOrderSchema } from 'src/common/schemas/add-item-to-order.schema';

export type AddItemToOrderDtoInput = Required<
  z.infer<typeof addItemToOrderSchema>
>;
