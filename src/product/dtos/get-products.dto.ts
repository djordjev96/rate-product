import { Expose, Type } from 'class-transformer';

class rating {
  @Expose() id: number;
  @Expose() comment: string;
  @Expose() rating: number;
}

class user {
  @Expose() username: string;
}
export class GetProductDto {
  @Expose()
  barcode: string;
  @Expose()
  name: string;
  @Expose()
  category: string;
  @Expose()
  createdAt: Date;
  @Expose()
  avgRating: number;
  @Expose()
  numOfRatings: number;
  @Expose()
  @Type(() => rating)
  ratings: rating[];
}
