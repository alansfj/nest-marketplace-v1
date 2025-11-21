import { Controller, Get, Param } from '@nestjs/common';

import { UserRepository } from './user.repository';

@Controller('user')
export class UserController {
  constructor(private readonly userRepository: UserRepository) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userRepository.findOneById(+id);
  }
}
