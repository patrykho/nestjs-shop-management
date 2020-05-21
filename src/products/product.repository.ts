import { EntityRepository, Repository } from 'typeorm';

import { Product } from './product.entity';
import { CreateProductDto } from './dtos/create-product-dto';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const product: Product = new Product();
    const { title, description, imageUrl, price } = createProductDto;

    product.title = title;
    product.description = description;
    product.price = parseFloat(price.toFixed(2));
    product.imageUrl = imageUrl;
    await product.save();
    return product;
  }
}
