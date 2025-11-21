import { Controller, Get, Param } from '@nestjs/common';
import { IUserService } from 'src/types/user/user.service.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: IUserService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOneById(+id);
  }
}
