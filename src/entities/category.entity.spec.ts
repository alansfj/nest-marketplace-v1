import { EntityValidationException } from 'src/common/exceptions/entity-validation.exception';
import { Category } from './category.entity';

describe('Category.create', () => {
  it('creates a category from a valid dto', () => {
    const category = Category.create({ name: 'Electronics' });

    expect(category.name).toBe('Electronics');
  });

  it.each([
    ['name is empty', { name: '' }],
    ['name is only whitespace', { name: '   ' }],
  ])('rejects a dto where %s', (_description, overrides) => {
    expect(() => Category.create(overrides)).toThrow(EntityValidationException);
  });
});
