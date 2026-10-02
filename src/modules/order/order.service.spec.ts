import { BadRequestException } from '@nestjs/common';

import { Currency } from 'src/types/currency.type';
import { OrderStatus } from 'src/types/order-status.type';
import { IOrderRepository } from 'src/types/order/order.repository.interface';
import { IUserService } from 'src/types/user/user.service.interface';
import { IProductService } from 'src/types/product/product.service.interface';
import { IOrderItemService } from 'src/types/order-item/order-item.service.interface';
import { Order } from 'src/entities/order.entity';
import { Product } from 'src/entities/product.entity';
import { User } from 'src/entities/user.entity';

// addItemToOrder is decorated with @Transactional() (typeorm-transactional),
// which needs a real, initialized DataSource to open a transaction. That's
// an integration concern, not a unit one, so the decorator is replaced with
// a pass-through here to keep this a true unit test of the business logic.
jest.mock('typeorm-transactional', () => ({
  ...jest.requireActual('typeorm-transactional'),
  Transactional:
    () => (_target: unknown, _key: string, descriptor: PropertyDescriptor) =>
      descriptor,
}));

import { OrderService } from './order.service';

function buildMockOrderRepository() {
  return {
    findOneByUserIdWithStatusCart: jest.fn(),
    save: jest.fn((entity) => Promise.resolve(entity)),
  } as unknown as jest.Mocked<IOrderRepository>;
}

function buildUser(overrides: Partial<User> = {}): User {
  return { __brand: 'User', id: 1, ...overrides } as unknown as User;
}

function buildProduct(overrides: Partial<Product> = {}): Product {
  return {
    __brand: 'Product',
    id: 10,
    name: 'Phone',
    price: '100.00',
    currency: Currency.MXN,
    quantity: 10,
    user: { id: 2 },
    ...overrides,
  } as unknown as Product;
}

function buildOrder(overrides: Partial<Order> = {}): Order {
  return {
    __brand: 'Order',
    id: 5,
    status: OrderStatus.CART,
    currency: Currency.MXN,
    subtotalAmount: '0.00',
    totalAmount: '0.00',
    ...overrides,
  } as unknown as Order;
}

describe('OrderService.addItemToOrder', () => {
  let orderRepository: jest.Mocked<IOrderRepository>;
  let userService: jest.Mocked<IUserService>;
  let productService: jest.Mocked<IProductService>;
  let orderItemService: jest.Mocked<IOrderItemService>;
  let service: OrderService;

  beforeEach(() => {
    orderRepository = buildMockOrderRepository();
    userService = {
      getUserFromId: jest.fn(),
    } as unknown as jest.Mocked<IUserService>;
    productService = {
      getProductByIdWithOwner: jest.fn(),
    } as unknown as jest.Mocked<IProductService>;
    orderItemService = {
      addItemToOrder: jest.fn().mockResolvedValue([]),
    } as unknown as jest.Mocked<IOrderItemService>;

    service = new OrderService(
      orderRepository,
      userService,
      productService,
      orderItemService,
    );
  });

  const dto = { productId: 10, productQuantity: 2 };

  it('rejects adding a product that belongs to the same user', async () => {
    const user = buildUser({ id: 1 } as Partial<User>);
    userService.getUserFromId.mockResolvedValue(user);
    productService.getProductByIdWithOwner.mockResolvedValue(
      buildProduct({ user: { id: 1 } } as Partial<Product>),
    );

    await expect(service.addItemToOrder(1, dto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('rejects when the requested quantity exceeds the available stock', async () => {
    userService.getUserFromId.mockResolvedValue(buildUser());
    productService.getProductByIdWithOwner.mockResolvedValue(
      buildProduct({ quantity: 1 } as Partial<Product>),
    );

    await expect(
      service.addItemToOrder(1, { productId: 10, productQuantity: 5 }),
    ).rejects.toThrow(BadRequestException);
    expect(orderRepository.save).not.toHaveBeenCalled();
  });

  it("rejects when the product's currency does not match the existing cart's currency", async () => {
    userService.getUserFromId.mockResolvedValue(buildUser());
    productService.getProductByIdWithOwner.mockResolvedValue(
      buildProduct({ currency: Currency.USD } as Partial<Product>),
    );
    orderRepository.findOneByUserIdWithStatusCart.mockResolvedValue(
      buildOrder({ currency: Currency.MXN } as Partial<Order>),
    );

    await expect(service.addItemToOrder(1, dto)).rejects.toThrow(
      BadRequestException,
    );
    expect(orderItemService.addItemToOrder).not.toHaveBeenCalled();
  });

  it('creates a new cart order when the user has none yet', async () => {
    userService.getUserFromId.mockResolvedValue(buildUser());
    productService.getProductByIdWithOwner.mockResolvedValue(buildProduct());
    orderRepository.findOneByUserIdWithStatusCart.mockResolvedValue(null);
    orderItemService.addItemToOrder.mockResolvedValue([
      { totalAmount: '200.00' } as any,
    ]);

    const result = await service.addItemToOrder(1, dto);

    expect(orderRepository.save).toHaveBeenCalled();
    expect(result.status).toBe(OrderStatus.CART);
    expect(result.subtotalAmount).toBe('200.00');
    expect(result.totalAmount).toBe('200.00');
  });

  it('reuses the existing cart order instead of creating a new one', async () => {
    const existingOrder = buildOrder();
    userService.getUserFromId.mockResolvedValue(buildUser());
    productService.getProductByIdWithOwner.mockResolvedValue(buildProduct());
    orderRepository.findOneByUserIdWithStatusCart.mockResolvedValue(
      existingOrder,
    );
    orderItemService.addItemToOrder.mockResolvedValue([
      { totalAmount: '100.00' } as any,
      { totalAmount: '50.00' } as any,
    ]);

    const result = await service.addItemToOrder(1, dto);

    expect(result.id).toBe(existingOrder.id);
    // totals are recalculated from the sum of every order item, not just
    // set once when the order is first created
    expect(result.subtotalAmount).toBe('150.00');
    expect(result.totalAmount).toBe('150.00');
  });

  it('exposes the order items in the result without a circular back-reference to the order', async () => {
    userService.getUserFromId.mockResolvedValue(buildUser());
    productService.getProductByIdWithOwner.mockResolvedValue(buildProduct());
    orderRepository.findOneByUserIdWithStatusCart.mockResolvedValue(
      buildOrder(),
    );
    orderItemService.addItemToOrder.mockResolvedValue([
      { id: 1, totalAmount: '100.00', order: buildOrder() } as any,
    ]);

    const result = await service.addItemToOrder(1, dto);

    expect(result.orderItems).toHaveLength(1);
    expect(result.orderItems[0].order).toBeUndefined();
  });
});
