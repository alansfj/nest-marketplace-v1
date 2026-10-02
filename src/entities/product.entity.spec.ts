import { EntityValidationException } from 'src/common/exceptions/entity-validation.exception';
import { Currency } from 'src/types/currency.type';
import { Product } from './product.entity';
import { Store } from './store.entity';
import { Subcategory } from './subcategory.entity';
import { User } from './user.entity';

const store = { __brand: 'Store', id: 1 } as unknown as Store;
const user = { __brand: 'User', id: 2 } as unknown as User;
const subcategory = { __brand: 'Subcategory', id: 3 } as unknown as Subcategory;

const validDto = {
  name: 'Wireless mouse',
  description: 'A mouse with no wires',
  store,
  user,
  subcategory,
  price: 100,
  currency: Currency.MXN,
  quantity: 5,
};

describe('Product.create', () => {
  it('creates a product from a valid dto', () => {
    const product = Product.create(validDto);

    expect(product.name).toBe('Wireless mouse');
    expect(product.price).toBe(100);
    expect(product.quantity).toBe(5);
    expect(product.store).toBe(store);
    expect(product.user).toBe(user);
    expect(product.subcategory).toBe(subcategory);
  });

  it.each([
    ['name is empty', { name: '' }],
    ['description is only whitespace', { description: '   ' }],
    ['price is zero', { price: 0 }],
    ['price is negative', { price: -1 }],
    ['quantity is zero', { quantity: 0 }],
    ['quantity is not an integer', { quantity: 2.5 }],
  ])('rejects a dto where %s', (_description, overrides) => {
    expect(() => Product.create({ ...validDto, ...overrides })).toThrow(
      EntityValidationException,
    );
  });

  it('rejects a store reference that is missing its brand', () => {
    const invalidStore = { id: 1 } as unknown as Store;

    expect(() => Product.create({ ...validDto, store: invalidStore })).toThrow(
      EntityValidationException,
    );
  });
});
