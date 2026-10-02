import { EntityValidationException } from 'src/common/exceptions/entity-validation.exception';
import { Category } from './category.entity';
import { Store } from './store.entity';
import { User } from './user.entity';

const user = { __brand: 'User', id: 1 } as unknown as User;
const categories = [{ __brand: 'Category', id: 1 } as unknown as Category];

const validDto = {
  name: 'My Store',
  description: 'A great store',
  user,
  categories,
};

describe('Store.create', () => {
  it('creates a store from a valid dto and derives nameNormalized', () => {
    const store = Store.create(validDto);

    expect(store.name).toBe('My Store');
    expect(store.nameNormalized).toBe('my-store');
    expect(store.user).toBe(user);
    expect(store.categories).toBe(categories);
  });

  it.each([
    ['name is empty', { name: '' }],
    ['description is only whitespace', { description: '   ' }],
  ])('rejects a dto where %s', (_description, overrides) => {
    expect(() => Store.create({ ...validDto, ...overrides })).toThrow(
      EntityValidationException,
    );
  });

  it('rejects a category reference that is missing its brand', () => {
    const invalidCategories = [{ id: 1 } as unknown as Category];

    expect(() =>
      Store.create({ ...validDto, categories: invalidCategories }),
    ).toThrow(EntityValidationException);
  });
});

describe('Store.normalizeName', () => {
  it.each([
    ['My Store', 'my-store'],
    ['  Leading and trailing spaces  ', 'leading-and-trailing-spaces'],
    ['Multiple   Spaces', 'multiple-spaces'],
    ['Café São Paulo', 'cafe-sao-paulo'],
    ["O'Brien's Shop!!", 'obriens-shop'],
    ['---Already---Dashed---', 'already-dashed'],
  ])('normalizes "%s" to "%s"', (input, expected) => {
    expect(Store.normalizeName(input)).toBe(expected);
  });
});
