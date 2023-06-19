import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AddUsernameDto {
  @IsString()
  username: string;
}
