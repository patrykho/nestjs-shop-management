import { IsString, IsEmail } from 'class-validator';

export class AuthSignInDto {
  @IsEmail()
  @IsString()
  login: string;

  @IsString()
  password: string;
}
