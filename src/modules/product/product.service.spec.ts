import { BadRequestException } from '@nestjs/common';

import { Currency } from 'src/types/currency.type';
import { IProductRepository } from 'src/types/product/product.repository.interface';
import { ISubcategoryService } from 'src/types/subcategory/subcategory.service.interface';
import { IUserService } from 'src/types/user/user.service.interface';
import { IStoreService } from 'src/types/store/store.service.interface';
import { Product } from 'src/entities/product.entity';
import { Store } from 'src/entities/store.entity';
import { Subcategory } from 'src/entities/subcategory.entity';
import { User } from 'src/entities/user.entity';

// createProduct/getProductFromId/getProductByIdWithOwner are all decorated
// with @Transactional(), which needs a real, initialized DataSource. See
// order.service.spec.ts for why this is mocked as a pass-through here.
jest.mock('typeorm-transactional', () => ({
  ...jest.requireActual('typeorm-transactional'),
  Transactional:
    () => (_target: unknown, _key: string, descriptor: PropertyDescriptor) =>
      descriptor,
}));

import { ProductService } from './product.service';

function buildProduct(overrides: Partial<Product> = {}): Product {
  return {
    __brand: 'Product',
    id: 10,
    name: 'Phone',
    price: '100.00',
    currency: Currency.MXN,
    quantity: 10,
    ...overrides,
  } as unknown as Product;
}

describe('ProductService', () => {
  let productRepository: jest.Mocked<IProductRepository>;
  let subcategoryService: jest.Mocked<ISubcategoryService>;
  let userService: jest.Mocked<IUserService>;
  let storeService: jest.Mocked<IStoreService>;
  let service: ProductService;

  beforeEach(() => {
    productRepository = {
      findOneByIdForUpdate: jest.fn(),
      findOneByIdForUpdateWithOwner: jest.fn(),
      save: jest.fn((entity) => Promise.resolve(entity)),
    } as unknown as jest.Mocked<IProductRepository>;
    subcategoryService = {
      getSubcategoryFromId: jest.fn(),
    } as unknown as jest.Mocked<ISubcategoryService>;
    userService = {
      getUserFromId: jest.fn(),
    } as unknown as jest.Mocked<IUserService>;
    storeService = {
      getStoreFromId: jest.fn(),
    } as unknown as jest.Mocked<IStoreService>;

    service = new ProductService(
      productRepository,
      subcategoryService,
      userService,
      storeService,
    );
  });

  describe('getProductFromId', () => {
    it('returns the product when it exists', async () => {
      const product = buildProduct();
      productRepository.findOneByIdForUpdate.mockResolvedValue(product);

      await expect(service.getProductFromId(10)).resolves.toBe(product);
    });

    it('throws when the product does not exist', async () => {
      productRepository.findOneByIdForUpdate.mockResolvedValue(null);

      await expect(service.getProductFromId(999)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getProductByIdWithOwner', () => {
    it('returns the product when it exists', async () => {
      const product = buildProduct();
      productRepository.findOneByIdForUpdateWithOwner.mockResolvedValue(
        product,
      );

      await expect(service.getProductByIdWithOwner(10)).resolves.toBe(product);
    });

    it('throws when the product does not exist', async () => {
      productRepository.findOneByIdForUpdateWithOwner.mockResolvedValue(null);

      await expect(service.getProductByIdWithOwner(999)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('createProduct', () => {
    it('resolves the owner, subcategory and store, then saves the new product', async () => {
      const user = { __brand: 'User', id: 1 } as unknown as User;
      const subcategory = {
        __brand: 'Subcategory',
        id: 2,
      } as unknown as Subcategory;
      const store = { __brand: 'Store', id: 3 } as unknown as Store;

      userService.getUserFromId.mockResolvedValue(user);
      subcategoryService.getSubcategoryFromId.mockResolvedValue(subcategory);
      storeService.getStoreFromId.mockResolvedValue(store);

      const dto = {
        name: 'Phone',
        description: 'A phone',
        price: 100,
        currency: Currency.MXN,
        quantity: 5,
        subcategory: 2,
        store: 3,
      };

      const result = await service.createProduct(1, dto);

      expect(userService.getUserFromId).toHaveBeenCalledWith(1);
      expect(subcategoryService.getSubcategoryFromId).toHaveBeenCalledWith(2);
      expect(storeService.getStoreFromId).toHaveBeenCalledWith(3);
      expect(productRepository.save).toHaveBeenCalledTimes(1);
      expect(result.name).toBe('Phone');
      expect(result.user).toBe(user);
      expect(result.subcategory).toBe(subcategory);
      expect(result.store).toBe(store);
    });
  });
});
