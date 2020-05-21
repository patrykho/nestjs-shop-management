import { IsString, IsNumber, IsUrl } from 'class-validator';
export class CreateProductDto {
  @IsString()
  title: string;

  @IsUrl()
  @IsString()
  imageUrl: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;
}
