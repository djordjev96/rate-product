import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/guards/firebase-auth.guard';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { User } from 'src/user/user.entity';
import { AddUsernameDto } from './dtos/add-username.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/username')
  @UseGuards(FirebaseAuthGuard)
  postRating(@Body() body: AddUsernameDto, @CurrentUser() user: User) {
    return this.userService.configureUsername(body.username, user);
  }
}
