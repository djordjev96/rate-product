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
import { FirebaseModule } from 'nestjs-firebase';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const dbConfig = require('../ormconfig.js');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      // DI part
      useFactory: (config: ConfigService) => {
        if (process.env.NODE_ENV === 'development') {
          return {
            type: 'sqlite',
            database: 'db.sqlite',
            synchronize: true,
            entities: [User, Rating, Product],
          };
        } else if (process.env.NODE_ENV === 'production') {
          return {
            type: 'postgres',
            url: config.get<string>('DATABASE_URL'),
            synchronize: true,
            entities: [User, Rating, Product],
          };
        }
      },
    }),
    // TypeOrmModule.forRoot(dbConfig),
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'db.sqlite',
    //   entities: [User, Rating, Product],
    //   synchronize: true,
    // }),
    FirebaseModule.forRoot({
      googleApplicationCredential: 'src/firebase/firebase.config.json',
    }),
    TypeOrmModule.forFeature([Product, User, Rating]),
    ProductModule,
    RatingModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, FirebaseAuthStrategy, UserService],
})
export class AppModule {}
