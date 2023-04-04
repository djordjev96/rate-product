import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/product/product.entity';
import { RatingController } from './rating.controller';
import { Rating } from './rating.entity';
import { RatingService } from './rating.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rating, Product])],
  controllers: [RatingController],
  providers: [RatingService],
})
export class RatingModule {}
