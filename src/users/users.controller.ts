import {
  Controller,
  Param,
  Body,
  ValidationPipe,
  Get,
  Patch,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UsersService } from './users.service';
import { User } from './user.entity';
import { UserUpdateDto } from './dtos/user-update.dto';
import { GetUserDto } from './dtos/get-user.dto';
import { GetUser } from './get-user.decorator';

@Controller('users')
@UseGuards(AuthGuard())
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/:id')
  getUserById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() userFromToken: User,
  ): Promise<GetUserDto> {
    return this.usersService.getUserById(id, userFromToken);
  }

  @Patch('/:id')
  updateUserData(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) userUpdateDto: UserUpdateDto,
    @GetUser() userFromToken: User,
  ): Promise<GetUserDto> {
    return this.usersService.updateUserData(id, userUpdateDto, userFromToken);
  }
}
