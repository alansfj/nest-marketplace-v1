import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';

import { User } from 'src/entities/user.entity';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { ZodValidationPipe } from 'src/common/pipes/validation.pipe';
import { increaseUserBalanceSchema } from 'src/common/schemas/increase-user-balance.schema';
import { IUserBalanceService } from 'src/types/user-balance/user-balance.service.interface';
import { IncreaseUserBalanceDtoInput } from './dtos/increase-user-balance.dto.input';
import { DtoOutputInterceptor } from 'src/common/interceptors/dto-output.interceptor';
import { IncreaseUserBalanceDtoOutput } from './dtos/increase-user-balance.dto.output';

@Controller('balance')
export class UserBalanceController {
  constructor(private readonly userBalanceService: IUserBalanceService) {}

  @Post('increase')
  @UseInterceptors(new DtoOutputInterceptor(IncreaseUserBalanceDtoOutput))
  increaseUserBalance(
    @AuthUser() user: User,
    @Body(new ZodValidationPipe(increaseUserBalanceSchema))
    dto: IncreaseUserBalanceDtoInput,
  ) {
    return this.userBalanceService.increaseUserBalance(user, dto.quantity);
  }
}
