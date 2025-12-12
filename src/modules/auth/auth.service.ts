import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from 'src/entities/user.entity';
import { RegisterDtoInput } from 'src/modules/auth/dtos/register/register.dto.input';
import { IUserService } from 'src/types/user/user.service.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: IUserService,
    private jwtService: JwtService,
  ) {}

  async registerUser(registerDto: RegisterDtoInput): Promise<User> {
    return this.userService.registerUser(registerDto);
  }

  async validateUser(
    email: string,
    userPassword: string,
  ): Promise<User | null> {
    const user = await this.userService.findOneByEmail(email);

    if (!user) return null;

    const isMatch = await bcrypt.compare(userPassword, user.password);

    if (!user || !isMatch) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;

    return rest as User;
  }

  async login(user: User): Promise<{
    access_token: string;
  }> {
    const payload = {
      email: user.email,
      sub: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
