import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { JwtPayloadI } from './jwt-payload.interface';

import { UserRepository } from 'src/users/user.repository';
import { User } from 'src/users/user.entity';
import { secretJwt } from '../constants/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secretJwt,
    });
  }

  async validate(payload: JwtPayloadI): Promise<User> {
    const { login } = payload;
    const selectedUser = await this.userRepository.findOne({ login });

    if (!selectedUser) {
      throw new UnauthorizedException('Not authorized');
    }
    return selectedUser;
  }
}
