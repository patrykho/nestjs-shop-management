import { IsString, IsNumber } from 'class-validator';

export class GetUserDto {
  @IsNumber()
  id: number;

  @IsString()
  login: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
