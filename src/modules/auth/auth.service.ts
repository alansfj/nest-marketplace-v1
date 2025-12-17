import { BadRequestException, Injectable } from '@nestjs/common';
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

  async registerNewUser(registerDto: RegisterDtoInput): Promise<User> {
    return this.userService.registerNewUser(registerDto);
  }

  async validateUserPassword(email: string, password: string): Promise<User> {
    const user = await this.userService.getUserForPasswordValidation(email);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!user || !isMatch) {
      throw new BadRequestException('bad credentials');
    }

    return user;
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
