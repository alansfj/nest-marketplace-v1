import { Controller } from '@nestjs/common';
import { IUserService } from 'src/types/user/user.service.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: IUserService) {}
}
