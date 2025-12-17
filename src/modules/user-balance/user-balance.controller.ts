import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';

import { ZodValidationPipe } from 'src/common/pipes/validation.pipe';
import { increaseUserBalanceSchema } from 'src/common/schemas/increase-user-balance.schema';
import { IUserBalanceService } from 'src/types/user-balance/user-balance.service.interface';
import { IncreaseUserBalanceDtoInput } from './dtos/increase-user-balance.dto.input';
import { DtoOutputInterceptor } from 'src/common/interceptors/dto-output.interceptor';
import { IncreaseUserBalanceDtoOutput } from './dtos/increase-user-balance.dto.output';
import { IAuthUser } from 'src/types/auth-user.interface';
import { UserInReq } from 'src/common/decorators/user-in-req.decorator';

@Controller('balance')
export class UserBalanceController {
  constructor(private readonly userBalanceService: IUserBalanceService) {}

  @Post('increase')
  @UseInterceptors(new DtoOutputInterceptor(IncreaseUserBalanceDtoOutput))
  increaseUserBalance(
    @UserInReq() user: IAuthUser,
    @Body(new ZodValidationPipe(increaseUserBalanceSchema))
    dto: IncreaseUserBalanceDtoInput,
  ) {
    return this.userBalanceService.increaseUserBalance(user.id, dto.quantity);
  }
}
