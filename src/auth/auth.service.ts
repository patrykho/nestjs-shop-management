import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { UserRepository } from 'src/users/user.repository';
import { AuthSignUpDto } from './dtos/auth-sign-up.dto';
import { AuthSignInDto } from './dtos/auth-sign-in.dto';
import { JwtPayloadI } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authSignUpDto: AuthSignUpDto): Promise<void> {
    return this.userRepository.signUp(authSignUpDto);
  }

  async signIn(authSignInDto: AuthSignInDto): Promise<{ accessToken: string }> {
    const ifSuccessLogin = await this.userRepository.checkUserPassword(
      authSignInDto,
    );
    if (!ifSuccessLogin) {
      throw new UnauthorizedException('Invalid login or password');
    } else {
      const payload: JwtPayloadI = { login: ifSuccessLogin };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    }
  }
}
