import { Expose } from 'class-transformer';

export class RegisterDtoOutput {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  // @Expose()
  // get fullName(): string {
  //   return `${this.firstName} ${this.lastName}`;
  // }
}
