import { EntityValidationException } from 'src/common/exceptions/entity-validation.exception';
import { Currency } from 'src/types/currency.type';
import { OrderStatus } from 'src/types/order-status.type';
import { Order } from './order.entity';
import { User } from './user.entity';

const user = { __brand: 'User', id: 1 } as unknown as User;

const validDto = {
  user,
  status: OrderStatus.CART,
  subtotalAmount: 100,
  totalAmount: 100,
  currency: Currency.MXN,
};

describe('Order.create', () => {
  it('creates an order from a valid dto', () => {
    const order = Order.create(validDto);

    expect(order.status).toBe(OrderStatus.CART);
    expect(order.subtotalAmount).toBe(100);
    expect(order.totalAmount).toBe(100);
    expect(order.currency).toBe(Currency.MXN);
    expect(order.user).toBe(user);
  });

  it.each([
    ['subtotalAmount is zero', { subtotalAmount: 0 }],
    ['totalAmount is negative', { totalAmount: -1 }],
    ['status is not a valid OrderStatus', { status: 'NOT_A_STATUS' }],
    ['currency is not a valid Currency', { currency: 'EUR' }],
  ])('rejects a dto where %s', (_description, overrides) => {
    expect(() => Order.create({ ...validDto, ...overrides } as any)).toThrow(
      EntityValidationException,
    );
  });

  it('rejects a user reference that is missing its brand', () => {
    const invalidUser = { id: 1 } as unknown as User;

    expect(() => Order.create({ ...validDto, user: invalidUser })).toThrow(
      EntityValidationException,
    );
  });
});
