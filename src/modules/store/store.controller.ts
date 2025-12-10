import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';

import { ZodValidationPipe } from 'src/common/pipes/validation.pipe';
import { createStoreSchema } from 'src/common/schemas/create-store.schema';
import { CreateStoreDtoInput } from './dtos/create-store.dto.input';
import { User } from 'src/common/decorators/user.decorator';
import { AuthUser } from 'src/types/auth/auth-user.type';
import { IStoreService } from 'src/types/store/store.service.interface';
import { DtoOutputInterceptor } from 'src/common/interceptors/dto-output.interceptor';
import { CreateStoreDtoOutput } from './dtos/create-store.dto.output';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: IStoreService) {}

  @Post()
  @UseInterceptors(new DtoOutputInterceptor(CreateStoreDtoOutput))
  createStore(
    @User() user: AuthUser,
    @Body(new ZodValidationPipe(createStoreSchema))
    dto: CreateStoreDtoInput,
  ) {
    return this.storeService.createStore(user.id, dto);
  }
}
