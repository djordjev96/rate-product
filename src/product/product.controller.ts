import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/guards/firebase-auth.guard';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { User } from 'src/user/user.entity';
import { AddProductDto } from './dtos/add-product.dto';
import { GetAllProducts } from './dtos/get-all-products.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  @UseGuards(FirebaseAuthGuard)
  getAllProducts(@Query() query: GetAllProducts) {
    return this.productService.getProducts(query);
  }

  @Post()
  @UseGuards(FirebaseAuthGuard)
  addProduct(@Body() body: AddProductDto, @CurrentUser() user: User) {
    return this.productService.addProduct(body, user);
  }

  @Get('/:barcode')
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
