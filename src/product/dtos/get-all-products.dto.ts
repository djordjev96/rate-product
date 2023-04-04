import { IsNumber, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetAllProducts {
  @IsString()
  name: string;

  @IsString()
  category: string;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  page: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  limit: number;
}
