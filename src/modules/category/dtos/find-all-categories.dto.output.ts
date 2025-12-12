import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class FindAllCategoriesDtoOutput {
  @Expose()
  id: number;

  @Expose()
  name: string;
}
