import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { DtoOutputInterceptor } from 'src/common/interceptors/dto-output.interceptor';
import { ICategoryService } from 'src/types/category/category.service.interface';
import { FindAllCategoriesDtoOutput } from './dtos/find-all-categories.dto.output';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: ICategoryService) {}

  @Get()
  @UseInterceptors(new DtoOutputInterceptor(FindAllCategoriesDtoOutput))
  findAll() {
    return this.categoryService.findAllReadOnly(['id', 'name']);
  }
}
