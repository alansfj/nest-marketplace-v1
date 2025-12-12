import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUserService } from 'src/types/user/user.service.interface';
import { User } from 'src/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly userService: IUserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any): Promise<User> {
    const user = await this.userService.findOneById(payload.sub, [
      'id',
      'email',
      'firstName',
      'lastName',
      'createdDate',
      'updatedDate',
      'deletedDate',
    ]);

    if (user) return user as User;

    throw new UnauthorizedException();
  }
}
