import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Subcategory } from 'src/entities/subcategory.entity';
import { SubcategoryService } from './subcategory.service';
import { ISubcategoryService } from 'src/types/subcategory/subcategory.service.interface';
import { ISubcategoryRepository } from 'src/types/subcategory/subcategory.repository.interface';
import { SubcategoryTypeormRepository } from './subcategory.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Subcategory])],
  controllers: [],
  providers: [
    {
      provide: ISubcategoryService,
      useClass: SubcategoryService,
    },
    {
      provide: ISubcategoryRepository,
      useClass: SubcategoryTypeormRepository,
    },
  ],
  exports: [ISubcategoryService],
})
export class SubcategoryModule {}
