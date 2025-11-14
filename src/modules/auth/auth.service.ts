import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { RegisterDtoInput } from 'src/modules/auth/dtos/register/register.dto.input';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async registerUser(registerDto: RegisterDtoInput) {
    const user = await this.userService.findOneByEmail(registerDto.email);

    if (!user) {
      return this.userService.create(registerDto);
    }

    throw new BadRequestException('user with that email already exists.');
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);

    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);

    if (!user || !isMatch) return null;

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  async login(user: any): Promise<{
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
