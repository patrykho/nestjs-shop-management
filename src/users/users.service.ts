import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { UserUpdateDto } from './dtos/user-update.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async getUserByLogin(id: number): Promise<User> {
    const selectedUser = await this.userRepository.findOne({ id });

    if (!selectedUser) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
    return selectedUser;
  }

  async updateUserData(id: number, userUpdateDto: UserUpdateDto) {
    const { firstName, lastName, currentPassword, newPassword } = userUpdateDto;
    const user = await this.getUserByLogin(id);

    // @TODO Validation currentPassword

    if (firstName) {
      user.firstName = firstName;
    }
    if (lastName) {
      user.lastName = lastName;
    }
    if (currentPassword && newPassword) {
      // @TODO hash newPassword
      user.password = newPassword;
    }
    await user.save();

    delete user.password;
    return user;
  }
}
