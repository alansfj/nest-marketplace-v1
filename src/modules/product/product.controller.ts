import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';

import { UserInReq } from 'src/common/decorators/user-in-req.decorator';
import { ZodValidationPipe } from 'src/common/pipes/validation.pipe';
import { IAuthUser } from 'src/types/auth-user.interface';
import { IProductService } from 'src/types/product/product.service.interface';
import { CreateProductDtoInput } from './dtos/create-product.dto.input';
import { createProductSchema } from 'src/common/schemas/create-product.schema';
import { CreateProductDtoOutput } from './dtos/create-product.dto.output';
import { DtoOutputInterceptor } from 'src/common/interceptors/dto-output.interceptor';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: IProductService) {}

  @Post()
  @UseInterceptors(new DtoOutputInterceptor(CreateProductDtoOutput))
  createStore(
    @UserInReq() user: IAuthUser,
    @Body(new ZodValidationPipe(createProductSchema))
    dto: CreateProductDtoInput,
  ) {
    return this.productService.createProduct(user.id, dto);
  }
}
