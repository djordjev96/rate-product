import { Rating } from 'src/rating/rating.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryColumn()
  barcode: string;

  @Column()
  name: string;

  @Column()
  image: string;

  @Column()
  category: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Rating, (rating) => rating.product)
  ratings: Rating[];

  @ManyToOne(() => User, (user) => user.products)
  user: User;
}
