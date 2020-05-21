import { Test } from '@nestjs/testing';

import { ProductsService } from './products.service';
import { ProductRepository } from './product.repository';
import { CreateProductDto } from './dtos/create-product-dto';
import { NotFoundException } from '@nestjs/common';

const PRODUCT_WITH_ID = {
  id: 1,
  title: 'APPLE MacBook Pro 16 i5',
  imageUrl:
    'https://www.mediaexpert.pl/media/cache/gallery/product/2/295/116/565/1vjqtsjy/images/20/2097809/APPLE-MacBook-Pro-16-front.jpg',
  description:
    'Oto najpotężniejszy notebook od Apple. Stworzony dla twórców. Ma niesamowity wyświetlacz Retina o przekątnej 16 cali, superszybkie procesory, grafikę nowej generacji, najpojemniejszą baterię w historii MacBooka Pro, nową klawiaturę Magic Keyboard i olbrzymią pamięć masową. To najdoskonalszy sprzęt dla najbardziej wymagających profesjonalistów.',
  price: 11224.33,
};

const PRODUCT: CreateProductDto = {
  title: 'APPLE MacBook Pro 16 i5',
  imageUrl:
    'https://www.mediaexpert.pl/media/cache/gallery/product/2/295/116/565/1vjqtsjy/images/20/2097809/APPLE-MacBook-Pro-16-front.jpg',
  description:
    'Oto najpotężniejszy notebook od Apple. Stworzony dla twórców. Ma niesamowity wyświetlacz Retina o przekątnej 16 cali, superszybkie procesory, grafikę nowej generacji, najpojemniejszą baterię w historii MacBooka Pro, nową klawiaturę Magic Keyboard i olbrzymią pamięć masową. To najdoskonalszy sprzęt dla najbardziej wymagających profesjonalistów.',
  price: 11224.33,
};

const PRODUCT_UPDATED_TITLE: CreateProductDto = {
  title: 'BEST APPLE MacBook Pro 16 i5',
  imageUrl:
    'https://www.mediaexpert.pl/media/cache/gallery/product/2/295/116/565/1vjqtsjy/images/20/2097809/APPLE-MacBook-Pro-16-front.jpg',
  description:
    'Oto najpotężniejszy notebook od Apple. Stworzony dla twórców. Ma niesamowity wyświetlacz Retina o przekątnej 16 cali, superszybkie procesory, grafikę nowej generacji, najpojemniejszą baterię w historii MacBooka Pro, nową klawiaturę Magic Keyboard i olbrzymią pamięć masową. To najdoskonalszy sprzęt dla najbardziej wymagających profesjonalistów.',
  price: 11224.33,
};

const PRODUCT_WITH_ID_UPDATED_TITLE = {
  id: 1,
  title: 'BEST APPLE MacBook Pro 16 i5',
  imageUrl:
    'https://www.mediaexpert.pl/media/cache/gallery/product/2/295/116/565/1vjqtsjy/images/20/2097809/APPLE-MacBook-Pro-16-front.jpg',
  description:
    'Oto najpotężniejszy notebook od Apple. Stworzony dla twórców. Ma niesamowity wyświetlacz Retina o przekątnej 16 cali, superszybkie procesory, grafikę nowej generacji, najpojemniejszą baterię w historii MacBooka Pro, nową klawiaturę Magic Keyboard i olbrzymią pamięć masową. To najdoskonalszy sprzęt dla najbardziej wymagających profesjonalistów.',
  price: 11224.33,
};

const mockProductsRepository = () => ({
  createProduct: jest.fn(),
});

describe('ProductsService', () => {
  let productRepository;
  let productsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: ProductRepository, useFactory: mockProductsRepository },
        ProductsService,
      ],
    }).compile();

    productRepository = module.get<ProductRepository>(ProductRepository);
    productsService = module.get<ProductsService>(ProductsService);
  });

  describe('createProduct', () => {
    it(' productRepository.createProduct() and returns the product with id', async () => {
      productRepository.createProduct.mockResolvedValue(PRODUCT_WITH_ID);

      expect(productRepository.createProduct).not.toHaveBeenCalled();

      const createProductDto = PRODUCT;
      const result = await productRepository.createProduct(createProductDto);
      expect(productRepository.createProduct).toHaveBeenCalledWith(
        createProductDto,
      );
      expect(result).toEqual(PRODUCT_WITH_ID);
    });
  });

  describe('updateProduct', () => {
    it('ProductsService.updateProduct() return updated product', async () => {
      const save = jest.fn().mockResolvedValue(true);
      expect(save).not.toHaveBeenCalled();

      productsService.getProductById = jest
        .fn()
        .mockResolvedValue({ ...PRODUCT_WITH_ID, save });

      expect(productsService.getProductById).not.toHaveBeenCalled();

      const result = await productsService.updateProduct(
        1,
        PRODUCT_UPDATED_TITLE,
      );

      expect(productsService.getProductById).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      delete result.save;

      expect(result).toEqual(PRODUCT_WITH_ID_UPDATED_TITLE);
    });

    it('ProductsService.updateProduct() no product found throw NotFoundException ', async () => {
      productRepository.findOne = jest.fn().mockResolvedValue(null);
      expect(
        productsService.updateProduct(1, PRODUCT_UPDATED_TITLE),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
