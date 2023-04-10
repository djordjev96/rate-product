import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/guards/firebase-auth.guard';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { User } from 'src/user/user.entity';
import { AddProductDto } from './dtos/add-product.dto';
import { GetAllProducts } from './dtos/get-all-products.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductService } from './product.service';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { GetProductDto } from './dtos/get-products.dto';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  @Serialize(GetProductDto)
  @UseGuards(FirebaseAuthGuard)
  getAllProducts(@Query() query: GetAllProducts) {
    return this.productService.getProducts(query);
  }

  @Post()
  @UseGuards(FirebaseAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  addProduct(
    @Body() body: AddProductDto,
    @CurrentUser() user: User,
    @UploadedFile()
    file?: Express.Multer.File,
  ) {
    return this.productService.addProduct(body, user, file);
  }

  @Get('/:barcode')
  @Serialize(GetProductDto)
  @UseGuards(FirebaseAuthGuard)
  getProductByBarcode(@Param('barcode') barcode: string) {
    return this.productService.getProductByBarcode(barcode);
  }

  @Patch('/:barcode')
  @UseGuards(FirebaseAuthGuard)
  updateProduct(
    @Param('barcode') barcode: string,
    @Body() body: UpdateProductDto,
  ) {
    return this.productService.updateProduct(barcode, body);
  }

  @Delete('/:barcode')
  @UseGuards(FirebaseAuthGuard)
  deleteProduct(@Param('barcode') barcode: string, @CurrentUser() user: User) {
    return this.productService.deleteProduct(barcode, user);
  }
}
