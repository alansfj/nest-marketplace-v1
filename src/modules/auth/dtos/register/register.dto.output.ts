import { Exclude } from 'class-transformer';

export class RegisterDtoOutput {
  id: number;

  email: string;

  firstName: string;

  lastName: string;

  @Exclude()
  createdDate: Date;

  @Exclude()
  updatedDate: Date;

  @Exclude()
  deletedDate: Date;

  // @Expose()
  // get fullName(): string {
  //   return `${this.firstName} ${this.lastName}`;
  // }
}
