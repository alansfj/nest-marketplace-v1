import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';

import { ZodValidationPipe } from 'src/common/pipes/validation.pipe';
import { createStoreSchema } from 'src/common/schemas/create-store.schema';
import { CreateStoreDtoInput } from './dtos/create-store.dto.input';
import { UserInReq } from 'src/common/decorators/user-in-req.decorator';
import { IStoreService } from 'src/types/store/store.service.interface';
import { DtoOutputInterceptor } from 'src/common/interceptors/dto-output.interceptor';
import { CreateStoreDtoOutput } from './dtos/create-store.dto.output';
import { validateStoreNameSchema } from 'src/common/schemas/validate-store-name.schema';
import { ValidateStoreNameDtoInput } from './dtos/validate-store-name.dto.input';
import { IAuthUser } from 'src/types/auth-user.interface';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: IStoreService) {}

  @Post()
  @UseInterceptors(new DtoOutputInterceptor(CreateStoreDtoOutput))
  createStore(
    @UserInReq() user: IAuthUser,
    @Body(new ZodValidationPipe(createStoreSchema))
    dto: CreateStoreDtoInput,
  ) {
    return this.storeService.createStore(user.id, dto);
  }

  @Get('validate-name')
  validateStoreName(
    @Query(new ZodValidationPipe(validateStoreNameSchema))
    dto: ValidateStoreNameDtoInput,
  ) {
    return this.storeService.validateStoreName(dto.name);
  }
}
