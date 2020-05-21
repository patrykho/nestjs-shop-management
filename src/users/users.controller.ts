import {
  Controller,
  Param,
  Body,
  ValidationPipe,
  Get,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { User } from './user.entity';
import { UserUpdateDto } from './dtos/user-update.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/:id')
  getUserByLogin(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.getUserByLogin(id);
  }

  @Patch('/:id')
  updateUserData(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) userUpdateDto: UserUpdateDto,
  ): Promise<User> {
    return this.usersService.updateUserData(id, userUpdateDto);
  }
}
