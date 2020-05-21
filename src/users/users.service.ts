import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { UserUpdateDto } from './dtos/user-update.dto';
import { GetUserDto } from './dtos/get-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async getUserById(id: number, userFromToken: User): Promise<GetUserDto> {
    if (id !== userFromToken.id) {
      throw new NotFoundException('Not authorized');
    }
    const user = await this.getUser(id);
    return this.transformUserToDto(user);
  }

  async updateUserData(
    id: number,
    userUpdateDto: UserUpdateDto,
    userFromToken: User,
  ): Promise<GetUserDto> {
    if (id !== userFromToken.id) {
      throw new NotFoundException('Not authorized');
    }

    const { firstName, lastName, currentPassword, newPassword } = userUpdateDto;
    const user: User = await this.getUser(id);
    const checkCurrentPassword = await user.checkPassword(currentPassword);

    if (!checkCurrentPassword) {
      throw new NotFoundException('Not authorized');
    }

    const getUserDto: GetUserDto = this.transformUserToDto(user);

    if (firstName) {
      user.firstName = firstName;
      getUserDto.firstName = firstName;
    }
    if (lastName) {
      user.lastName = lastName;
      getUserDto.lastName = lastName;
    }
    if (newPassword) {
      const salt = await this.userRepository.generateNewSalt();
      user.password = await this.userRepository.hashPassword(newPassword, salt);
      user.salt = salt;
    }
    await user.save();

    return getUserDto;
  }

  private async getUser(id: number): Promise<User> {
    const selectedUser = await this.userRepository.findOne({ id });

    if (!selectedUser) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
    return selectedUser;
  }

  private transformUserToDto(user: User): GetUserDto {
    const getUserDto = new GetUserDto();
    getUserDto.id = user.id;
    getUserDto.login = user.login;
    getUserDto.firstName = user.firstName;
    getUserDto.lastName = user.lastName;
    return getUserDto;
  }
}
