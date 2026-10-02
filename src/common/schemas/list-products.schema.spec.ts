import { listProductsSchema } from './list-products.schema';

describe('listProductsSchema', () => {
  it('defaults limit to 20 and offset to 0 when omitted', () => {
    expect(listProductsSchema.parse({})).toEqual({ limit: 20, offset: 0 });
  });

  it('coerces string query params into numbers', () => {
    expect(listProductsSchema.parse({ limit: '5', offset: '10' })).toEqual({
      limit: 5,
      offset: 10,
    });
  });

  it.each([
    ['limit is zero', { limit: '0' }],
    ['limit is negative', { limit: '-1' }],
    ['limit is not an integer', { limit: '1.5' }],
    ['limit exceeds the maximum of 100', { limit: '101' }],
    ['limit is not a number', { limit: 'abc' }],
    ['offset is negative', { offset: '-1' }],
    ['offset is not a number', { offset: 'abc' }],
  ])('rejects a query where %s', (_description, query) => {
    expect(() => listProductsSchema.parse(query)).toThrow();
  });

  it('accepts the maximum allowed limit', () => {
    expect(listProductsSchema.parse({ limit: '100' }).limit).toBe(100);
  });
});
