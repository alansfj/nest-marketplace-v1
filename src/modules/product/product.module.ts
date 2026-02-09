import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from 'src/entities/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { IProductService } from 'src/types/product/product.service.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [
    {
      provide: IProductService,
      useClass: ProductService,
    },
  ],
  exports: [IProductService],
})
export class ProductModule {}
