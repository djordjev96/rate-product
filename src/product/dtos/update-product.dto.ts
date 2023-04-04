import { IsString, IsOptional } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  category: string;
}
