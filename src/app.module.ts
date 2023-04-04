import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { RatingModule } from './rating/rating.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { Rating } from './rating/rating.entity';
import { Product } from './product/product.entity';
import { FirebaseAuthStrategy } from './firebase/firebase-auth.strategy';
import { UserService } from './user/user.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Rating, Product],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Product, User]),
    ProductModule,
    RatingModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, FirebaseAuthStrategy, UserService],
})
export class AppModule {}
