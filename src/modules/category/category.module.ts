import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Category } from 'src/entities/category.entity';
import { ICategoryService } from 'src/types/category/category.service.interface';
import { CategoryService } from './category.service';
import { ICategoryRepository } from 'src/types/category/category.repository.interface';
import { CategoryTypeormRepository } from './category.repository';
import { CategoryController } from './category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [
    {
      provide: ICategoryService,
      useClass: CategoryService,
    },
    {
      provide: ICategoryRepository,
      useClass: CategoryTypeormRepository,
    },
  ],
  exports: [ICategoryService],
})
export class CategoryModules {}
