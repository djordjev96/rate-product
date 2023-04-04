import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { ProductController } from './product.controller';
import { Product } from './product.entity';
import { ProductService } from './product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, User])],
  controllers: [ProductController],
  providers: [ProductService, UserService],
})
export class ProductModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(CurrentUserMiddleware).forRoutes('*');
  // }
}
