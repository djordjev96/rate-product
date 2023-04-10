import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as path from 'path';
import { FirebaseStorageProvider } from 'src/firebase/firebase-storage.provider';
import { Rating } from 'src/rating/rating.entity';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { AddProductDto } from './dtos/add-product.dto';
import { GetProductDto } from './dtos/get-products.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private repo: Repository<Product>,
    private firebaseStorageProvider: FirebaseStorageProvider,
  ) {}

  async checkIfProductExists(barcode: string): Promise<void> {
    const product = await this.repo.findOne({ where: { barcode } });
    if (!product) throw new NotFoundException('Product not found');
  }

  async getProductByBarcode(barcode: string): Promise<any> {
    const product = await this.repo
      .createQueryBuilder('product')
      .select('product.*')
      .addSelect('AVG(rating.rating)', 'avgRating')
      .addSelect('COUNT(product.barcode)', 'numOfRatings')
      .leftJoin('product.ratings', 'rating')
      .where('product.barcode = :barcode', { barcode })
      .groupBy('product.barcode')
      .getRawOne();

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async getProducts({
    name = '',
    category = '',
    page = 0,
    limit = 10,
  }): Promise<any> {
    const products = await this.repo
      .createQueryBuilder('product')
      .select('product.*')
      .addSelect('AVG(rating.rating)', 'avgRating')
      .addSelect('COUNT(rating.id)', 'numOfRatings')
      .leftJoin('product.ratings', 'rating')
      .where('product.name like :name', { name: `%${name}%` })
      .andWhere('product.category like :category', {
        category: `%${category}%`,
      })
      .groupBy('product.barcode')
      .limit(limit)
      .offset(limit * page)
      .getRawMany();
    // const products = (await this.repo.query(
    //   `SELECT "Product".*, AVG("Rating".rating) as avgRating, COUNT("Product".barcode) as numOfRatings
    //    FROM "Product" LEFT JOIN "Rating" ON "Product".barcode = "Rating".product
    //    WHERE "Product".name LIKE ${`${name}`} AND "Product".category LIKE ${`${category}`}
    //    GROUP BY "Product".barcode
    //    LIMIT ${limit} OFFSET ${page * limit}`,
    // )) as GetProductDto[];
    return products;
  }

  async addProduct(
    product: AddProductDto,
    user: User,
    file?: Express.Multer.File,
  ): Promise<Product | Product[]> {
    const exists = await this.repo.findOne({
      where: { barcode: product.barcode },
    });
    if (exists) return exists;

    let publicUrl = null;
    if (file) {
      const { destFileName, contentType, buffer } = this.fileConfig(
        file,
        product.category,
      );

      publicUrl = await this.firebaseStorageProvider.uploadBlob(
        destFileName,
        contentType,
        buffer,
      );
    }

    const newProduct = this.repo.create({
      ...product,
      image: publicUrl,
      user: user,
    });

    return await this.repo.save(newProduct);
  }

  fileConfig(file: Express.Multer.File, category: string) {
    const ext = path.extname(file.originalname);
    const contentType = file.mimetype;
    const buffer = file.buffer;
    const fileName = `${new Date().getTime()}${ext}`;
    const destFileName = `${category}/${fileName}`;

    return { destFileName, contentType, buffer };
  }

  async updateProduct(
    barcode: string,
    attrs: Partial<Product>,
  ): Promise<Product | null> {
    const product = await this.repo.findOne({
      where: { barcode },
    });

    if (!product) throw new NotFoundException('Product not found');

    Object.assign(product, attrs);

    return await this.repo.save(product);
  }

  async deleteProduct(barcode: string, user: User): Promise<Product | null> {
    const product = await this.repo.findOne({
      where: { barcode, user },
    });

    if (!product) throw new NotFoundException('Product not found');

    return await this.repo.remove(product);
  }
}
