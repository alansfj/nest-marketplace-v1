import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';

import { ZodValidationPipe } from 'src/common/pipes/validation.pipe';
import { createStoreSchema } from 'src/common/schemas/create-store.schema';
import { CreateStoreDtoInput } from './dtos/create-store.dto.input';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { IStoreService } from 'src/types/store/store.service.interface';
import { DtoOutputInterceptor } from 'src/common/interceptors/dto-output.interceptor';
import { CreateStoreDtoOutput } from './dtos/create-store.dto.output';
import { User } from 'src/entities/user.entity';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: IStoreService) {}

  @Post()
  @UseInterceptors(new DtoOutputInterceptor(CreateStoreDtoOutput))
  createStore(
    @AuthUser() user: User,
    @Body(new ZodValidationPipe(createStoreSchema))
    dto: CreateStoreDtoInput,
  ) {
    return this.storeService.createStore(user, dto);
  }
}
