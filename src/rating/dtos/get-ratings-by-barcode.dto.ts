import { IsString } from 'class-validator';

export class GetRatingsByBarcode {
  @IsString()
  barcode: string;
}
