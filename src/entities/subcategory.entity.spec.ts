import { EntityValidationException } from 'src/common/exceptions/entity-validation.exception';
import { Category } from './category.entity';
import { Subcategory } from './subcategory.entity';

const category = { __brand: 'Category', id: 1 } as unknown as Category;

describe('Subcategory.create', () => {
  it('creates a subcategory from a valid dto', () => {
    const subcategory = Subcategory.create({ category, name: 'Smartphones' });

    expect(subcategory.name).toBe('Smartphones');
    expect(subcategory.category).toBe(category);
  });

  it('rejects an empty name', () => {
    expect(() => Subcategory.create({ category, name: '' })).toThrow(
      EntityValidationException,
    );
  });

  it('rejects a category reference that is missing its brand', () => {
    const invalidCategory = { id: 1 } as unknown as Category;

    expect(() =>
      Subcategory.create({ category: invalidCategory, name: 'Smartphones' }),
    ).toThrow(EntityValidationException);
  });
});
