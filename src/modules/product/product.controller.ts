import { Body, Controller, Post } from '@nestjs/common';

import { UserInReq } from 'src/common/decorators/user-in-req.decorator';
import { ZodValidationPipe } from 'src/common/pipes/validation.pipe';
import { IAuthUser } from 'src/types/auth-user.interface';
import { IProductService } from 'src/types/product/product.service.interface';
import { CreateProductDtoInput } from './dtos/create-product.dto.input';
import { createProductSchema } from 'src/common/schemas/create-product.schema';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: IProductService) {}

  @Post()
  // @UseInterceptors(new DtoOutputInterceptor(CreateStoreDtoOutput))
  createStore(
    @UserInReq() user: IAuthUser,
    @Body(new ZodValidationPipe(createProductSchema))
    dto: CreateProductDtoInput,
  ) {
    return this.productService.createProduct(user.id, dto);
  }
}
