import { Product } from 'src/product/product.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  comment: string;

  @Column()
  rating: number;

  @ManyToOne(() => Product, (product) => product.ratings)
  product: Product;

  @ManyToOne(() => User, (user) => user.ratings)
  user: User;
}
