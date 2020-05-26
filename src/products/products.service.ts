import { Injectable, NotFoundException, UploadedFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createReadStream, createWriteStream } from 'fs';
import path = require('path');
import * as parse from 'csv-parse';
import * as transform from 'stream-transform';
import * as stringify from 'csv-stringify';

import { ProductRepository } from './product.repository';
import { Product } from './product.entity';
import { CreateProductDto } from './dtos/create-product-dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
  ) {}

  async uploadFile(@UploadedFile() file, res) {
    const fileName = file.filename;
    const fileNameCsv = file.filename + '.csv';
    const parser = parse({});

    const fileReadFromUser = createReadStream(
      path.join(__dirname, '../uploads', fileName),
      { emitClose: true },
    );
    const fileUpdateAndWrite = createWriteStream(
      path.join(__dirname, '../uploads', fileNameCsv),
    );

    const transformer = transform(function(data) {
      return data.map(function(value) {
        const regexEmail = /@yahoo.com$/;
        const isEmail = value.match(regexEmail);
        if (isEmail) {
          return ' ';
        }
        return value;
      });
    });

    const stringifier = stringify({
      delimiter: ',',
    });

    fileReadFromUser.on('readable', () => {
      let data;
      while ((data = fileReadFromUser.read())) {
        parser.write(data);
      }
    });

    fileReadFromUser.on('close', () => {
      parser.end();
      res.send({ fileName: fileNameCsv, message: 'file upload successful' });
    });

    parser.on('readable', function() {
      let data;
      while ((data = parser.read())) {
        transformer.write(data);
      }
    });

    parser.on('close', () => {
      transformer.end();
    });

    transformer.on('readable', function() {
      let data;
      while ((data = transformer.read())) {
        stringifier.write(data);
      }
    });

    transformer.on('close', () => {
      stringifier.end();
    });

    stringifier.on('readable', function() {
      let data;
      while ((data = stringifier.read())) {
        fileUpdateAndWrite.write(data);
      }
    });

    stringifier.on('close', () => {
      fileUpdateAndWrite.end();
    });

    fileUpdateAndWrite.on('readable', function() {
      let data;
      while ((data = stringifier.read())) {
        fileUpdateAndWrite.write(data);
      }
    });
  }
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
