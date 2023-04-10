import { Expose } from 'class-transformer';

export class GetProductDto {
  @Expose()
  barcode: string;
  @Expose()
  name: string;
  @Expose()
  image: string;
  @Expose()
  category: string;
  @Expose()
  createdAt: Date;
  @Expose()
  avgRating: number;
  @Expose()
  numOfRatings: number;
}
