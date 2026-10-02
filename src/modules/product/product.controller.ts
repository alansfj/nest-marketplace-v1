import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';

import { Public } from 'src/common/decorators/is-public.decorator.nest';
import { UserInReq } from 'src/common/decorators/user-in-req.decorator';
import { ZodValidationPipe } from 'src/common/pipes/validation.pipe';
import { IAuthUser } from 'src/types/auth-user.interface';
import { IProductService } from 'src/types/product/product.service.interface';
import { CreateProductDtoInput } from './dtos/create-product.dto.input';
import { ListProductsDtoInput } from './dtos/list-products.dto.input';
import { createProductSchema } from 'src/common/schemas/create-product.schema';
import { listProductsSchema } from 'src/common/schemas/list-products.schema';
import { CreateProductDtoOutput } from './dtos/create-product.dto.output';
import { ListProductsDtoOutput } from './dtos/list-products.dto.output';
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

  @Get()
  @Public()
  @UseInterceptors(new DtoOutputInterceptor(ListProductsDtoOutput))
  listProducts(
    @Query(new ZodValidationPipe(listProductsSchema))
    dto: ListProductsDtoInput,
  ) {
    return this.productService.listProducts(dto);
  }
}
