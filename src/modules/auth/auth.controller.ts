import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { Public } from 'src/common/decorators/is-public.decorator.nest';
import { ZodValidationPipe } from 'src/common/pipes/validation.pipe';
import { createUserSchema } from 'src/common/schemas/create-user.schema';
import { RegisterDtoInput } from 'src/modules/auth/dtos/register/register.dto.input';
import { DtoOutputInterceptor } from 'src/common/interceptors/dto-output.interceptor';
import { RegisterDtoOutput } from './dtos/register/register.dto.output';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @Public()
  @UseInterceptors(new DtoOutputInterceptor(RegisterDtoOutput))
  registerUser(
    @Body(new ZodValidationPipe(createUserSchema))
    registerDto: RegisterDtoInput,
  ) {
    return this.authService.registerUser(registerDto);
  }

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('test')
  test(@Request() req) {
    return req.user;
  }
}
