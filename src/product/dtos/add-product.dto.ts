import { User } from 'src/user/user.entity';

export class AddProductDto {
  barcode: string;
  name: string;
  image: string;
  category: string;
}
