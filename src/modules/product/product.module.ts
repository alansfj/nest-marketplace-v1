import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from 'src/entities/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { IProductService } from 'src/types/product/product.service.interface';
import { IProductRepository } from 'src/types/product/product.repository.interface';
import { ProductTypeormRepository } from './product.repository';
import { SubcategoryModule } from '../subcategory/subcategory.module';
import { UserModule } from '../user/user.module';
import { StoreModule } from '../store/store.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    SubcategoryModule,
    UserModule,
    StoreModule,
  ],
  controllers: [ProductController],
  providers: [
    {
      provide: IProductService,
      useClass: ProductService,
    },
    {
      provide: IProductRepository,
      useClass: ProductTypeormRepository,
    },
  ],
  exports: [IProductService],
})
export class ProductModule {}
