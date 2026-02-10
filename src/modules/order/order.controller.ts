import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';

import { UserInReq } from 'src/common/decorators/user-in-req.decorator';
import { ZodValidationPipe } from 'src/common/pipes/validation.pipe';
import { addItemToOrderSchema } from 'src/common/schemas/add-item-to-order.schema';
import { IAuthUser } from 'src/types/auth-user.interface';
import { IOrderService } from 'src/types/order/order.service.interface';
import { AddItemToOrderDtoInput } from './dtos/add-item-to-order.dto.input';
import { DtoOutputInterceptor } from 'src/common/interceptors/dto-output.interceptor';
import { AddItemToOrderDtoOutput } from './dtos/add-item-to-order.dto.output';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: IOrderService) {}

  @Post('item')
  @UseInterceptors(new DtoOutputInterceptor(AddItemToOrderDtoOutput))
  addItemToOrder(
    @UserInReq() user: IAuthUser,
    @Body(new ZodValidationPipe(addItemToOrderSchema))
    dto: AddItemToOrderDtoInput,
  ) {
    return this.orderService.addItemToOrder(user.id, dto);
  }
}
