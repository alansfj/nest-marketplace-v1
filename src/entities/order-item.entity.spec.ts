import { EntityValidationException } from 'src/common/exceptions/entity-validation.exception';
import { Currency } from 'src/types/currency.type';
import { OrderItem } from './order-item.entity';
import { Order } from './order.entity';
import { Product } from './product.entity';

// Minimal fixtures: OrderItem.create() only needs __brand + id from the
// related entities, it never reads any other field from them.
const order = { __brand: 'Order', id: 1 } as unknown as Order;
const product = { __brand: 'Product', id: 2 } as unknown as Product;

const validDto = {
  order,
  product,
  productName: 'Wireless mouse',
  price: 100,
  quantity: 2,
  currency: Currency.MXN,
  subtotalAmount: 200,
  totalAmount: 200,
};

describe('OrderItem.create', () => {
  it('creates an order item from a valid dto', () => {
    const orderItem = OrderItem.create(validDto);

    expect(orderItem.productName).toBe('Wireless mouse');
    expect(orderItem.price).toBe(100);
    expect(orderItem.quantity).toBe(2);
    expect(orderItem.subtotalAmount).toBe(200);
    expect(orderItem.totalAmount).toBe(200);
    expect(orderItem.order).toBe(order);
    expect(orderItem.product).toBe(product);
  });

  it.each([
    ['price is zero', { price: 0 }],
    ['price is negative', { price: -10 }],
    ['quantity is zero', { quantity: 0 }],
    ['quantity is not an integer', { quantity: 1.5 }],
    ['productName is empty', { productName: '' }],
    ['productName is only whitespace', { productName: '   ' }],
    ['subtotalAmount is zero', { subtotalAmount: 0 }],
  ])('rejects a dto where %s', (_description, overrides) => {
    expect(() => OrderItem.create({ ...validDto, ...overrides })).toThrow(
      EntityValidationException,
    );
  });

  it('rejects a product reference that is missing its brand', () => {
    const invalidProduct = { id: 2 } as unknown as Product;

    expect(() =>
      OrderItem.create({ ...validDto, product: invalidProduct }),
    ).toThrow(EntityValidationException);
  });
});
