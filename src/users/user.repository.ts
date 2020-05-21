import { Repository, EntityRepository } from 'typeorm';
import { BadRequestException, Param } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { User } from './user.entity';
import { AuthSignUpDto } from 'src/auth/dtos/auth-sign-up.dto';
import { AuthSignInDto } from 'src/auth/dtos/auth-sign-in.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authSignUpDto: AuthSignUpDto): Promise<void> {
    const { login, firstName, lastName, password } = authSignUpDto;
    const ifUserExist = await this.findOne({ login });

    if (ifUserExist) {
      throw new BadRequestException(
        `The login ${login} already exists. Please use a different login.`,
      );
    }

    const salt = await this.generateNewSalt();
    const user = new User();

    user.password = await this.hashPassword(password, salt);
    user.salt = salt;
    user.login = login;
    user.firstName = firstName;
    user.lastName = lastName;

    await user.save();
  }

  async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async generateNewSalt(): Promise<string> {
    return bcrypt.genSalt();
  }
  async checkUserPassword(authSignInDto: AuthSignInDto): Promise<string> {
    const { login, password } = authSignInDto;
    const selectedUser = await this.findOne({ login });
    if (selectedUser && (await selectedUser.checkPassword(password))) {
      return selectedUser.login;
    } else {
      return null;
    }
  }
}
