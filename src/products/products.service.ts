import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ProductRepository } from './product.repository';
import { Product } from './product.entity';
import { CreateProductDto } from './dtos/create-product-dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
  ) {}

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async getProduct(id: number): Promise<Product> {
    return this.getProductById(id);
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    return this.productRepository.createProduct(createProductDto);
  }

  async updateProduct(
    id: number,
    updateProductDto: CreateProductDto,
  ): Promise<Product> {
    const product: Product = await this.getProductById(id);
    const { title, description, imageUrl, price } = updateProductDto;

    product.title = title;
    product.description = description;
    product.price = parseFloat(price.toFixed(2));
    product.imageUrl = imageUrl;
    await product.save();
    return product;
  }

  async deleteProduct(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
  }

  private async getProductById(id: number): Promise<Product> {
    const selectedProduct = await this.productRepository.findOne(id);

    if (!selectedProduct) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    return selectedProduct;
  }
}
