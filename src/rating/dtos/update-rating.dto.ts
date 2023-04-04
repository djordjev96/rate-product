import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateRatingDto {
  @IsOptional()
  @IsString()
  comment: string;

  @IsOptional()
  @IsNumber()
  rating: number;
}
