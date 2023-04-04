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
import { AddRatingDto } from './dtos/add-rating.dto';
import { GetRatingsByBarcode } from './dtos/get-ratings-by-barcode.dto';
import { UpdateRatingDto } from './dtos/update-rating.dto';
import { RatingService } from './rating.service';

@Controller('ratings')
export class RatingController {
  constructor(private ratingService: RatingService) {}

  @Get()
  @UseGuards(FirebaseAuthGuard)
  getAllRatingsByBarcode(@Query() query: GetRatingsByBarcode) {
    return this.ratingService.getAllRatingsByBarcode(query.barcode);
  }

  @Post()
  @UseGuards(FirebaseAuthGuard)
  postRating(@Body() body: AddRatingDto, @CurrentUser() user: User) {
    return this.ratingService.addRating(body, user);
  }

  @Get('/:id')
  @UseGuards(FirebaseAuthGuard)
  getRating(@Param('id') id: string) {
    return this.ratingService.getRatingById(parseInt(id));
  }

  @Patch('/:id')
  @UseGuards(FirebaseAuthGuard)
  updateRating(
    @Param('id') id: string,
    @Body() body: UpdateRatingDto,
    @CurrentUser() user: User,
  ) {
    return this.ratingService.updateRating(parseInt(id), body, user);
  }

  @Delete('/:id')
  @UseGuards(FirebaseAuthGuard)
  deleteRating(@Param('id') id: string, @CurrentUser() user: User) {
    return this.ratingService.deleteRating(parseInt(id), user);
  }
}
