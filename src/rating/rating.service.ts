import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/product.entity';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { AddRatingDto } from './dtos/add-rating.dto';
import { Rating } from './rating.entity';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating) private ratingRepo: Repository<Rating>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  async getRatingById(id: number): Promise<Rating> {
    const rating = await this.ratingRepo.findOne({ where: { id } });

    if (!rating) throw new NotFoundException('Rating not found');

    return rating;
  }

  async getAllRatingsByBarcode(barcode: string): Promise<Rating[]> {
    const productExist = await this.productRepo.findOne({
      where: { barcode },
    });

    if (!productExist) throw new NotFoundException('Product not found');
    return await this.ratingRepo.find({ where: { product: productExist } });
  }

  async addRating(rating: AddRatingDto, user: User): Promise<Rating> {
    const productExist = await this.productRepo.findOne({
      where: { barcode: rating.barcode },
    });
    if (!productExist) throw new NotFoundException('Product not found');

    // const ratingExists = await this.ratingRepo.findOne({
    //   where: { product: productExist, user },
    // });
    // if (ratingExists) {
    //   throw new ForbiddenException('You already rated this product');
    // }
    const newRating = this.ratingRepo.create({
      ...rating,
      user,
      product: productExist,
    });

    return await this.ratingRepo.save(newRating);
  }

  async updateRating(
    id: number,
    rating: Partial<Rating>,
    user: User,
  ): Promise<Rating | null> {
    const oldRating = await this.getRatingById(id);

    if (oldRating.user.id !== user.id) {
      throw new ForbiddenException(`You can't update this rating`);
    }

    Object.assign(oldRating, rating);
    return await this.ratingRepo.save(oldRating);
  }

  async deleteRating(id: number, user: User): Promise<Rating | null> {
    const rating = await this.getRatingById(id);

    if (rating.user.id !== user.id) {
      throw new ForbiddenException(`You can't remove this rating`);
    }

    return await this.ratingRepo.remove(rating);
  }
}
