import { Product } from 'src/product/product.entity';
import { Rating } from 'src/rating/rating.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  role: string;

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @OneToMany(() => Rating, (rating) => rating.user)
  ratings: Rating[];
}
