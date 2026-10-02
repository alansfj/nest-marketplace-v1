import { BadRequestException } from '@nestjs/common';

import { Currency } from 'src/types/currency.type';
import { IOrderItemRepository } from 'src/types/order-item/order-item.repository.interface';
import { Order } from 'src/entities/order.entity';
import { OrderItem } from 'src/entities/order-item.entity';
import { Product } from 'src/entities/product.entity';
import { OrderItemService } from './order-item.service';

// IOrderItemRepository is an abstract class with many inherited members
// (findOneByIdForUpdate, findAllReadOnly, etc.) that this service never
// calls, so the mock only implements the two methods actually used and is
// cast to the interface type instead of stubbing every abstract member.
function buildMockRepository() {
  return {
    findManyByOrderIdWithProduct: jest.fn(),
    save: jest.fn((entity) => Promise.resolve(entity)),
  } as unknown as jest.Mocked<IOrderItemRepository>;
}

function buildOrder(overrides: Partial<Order> = {}): Order {
  // __brand is required because OrderItem.create() validates this object
  // against its newEntitySchema, which checks `order.__brand === 'Order'`.
  return { __brand: 'Order', id: 1, ...overrides } as unknown as Order;
}

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

function buildOrderItem(overrides: Partial<OrderItem> = {}): OrderItem {
  return {
    id: 99,
    product: buildProduct(),
    productName: 'Phone',
    price: '100.00',
    quantity: 1,
    currency: Currency.MXN,
    subtotalAmount: '100.00',
    totalAmount: '100.00',
    ...overrides,
  } as unknown as OrderItem;
}

describe('OrderItemService.addItemToOrder', () => {
  let repository: jest.Mocked<IOrderItemRepository>;
  let service: OrderItemService;

  beforeEach(() => {
    repository = buildMockRepository();
    service = new OrderItemService(repository);
  });

  it('creates a new order item when the product is not already in the cart', async () => {
    repository.findManyByOrderIdWithProduct.mockResolvedValue([]);

    const order = buildOrder();
    const product = buildProduct({ price: '50.00' });

    const result = await service.addItemToOrder(order, product, 3);

    expect(repository.save).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(1);
    expect(result[0].quantity).toBe(3);
    expect(result[0].subtotalAmount).toBe(150);
    expect(result[0].totalAmount).toBe(150);
  });

  it('keeps the other items in the cart when adding a new, different product', async () => {
    const existingItem = buildOrderItem({
      id: 1,
      product: buildProduct({ id: 20 }),
    });
    repository.findManyByOrderIdWithProduct.mockResolvedValue([existingItem]);

    const order = buildOrder();
    const newProduct = buildProduct({ id: 30, price: '25.00' });

    const result = await service.addItemToOrder(order, newProduct, 2);

    expect(result).toHaveLength(2);
    expect(result).toContain(existingItem);
  });

  it('merges the quantity into the existing item when the product is already in the cart', async () => {
    const existingItem = buildOrderItem({
      quantity: 2,
      product: buildProduct(),
    });
    repository.findManyByOrderIdWithProduct.mockResolvedValue([existingItem]);

    const order = buildOrder();
    const product = buildProduct({ quantity: 10, price: '100.00' });

    const result = await service.addItemToOrder(order, product, 3);

    expect(result).toHaveLength(1);
    expect(result[0].quantity).toBe(5);
    expect(result[0].subtotalAmount).toBe('500.00');
    expect(result[0].totalAmount).toBe('500.00');
    expect(repository.save).toHaveBeenCalledWith(existingItem);
  });

  it("recalculates using the product's current price, not the item's stale stored price", async () => {
    // Regression test: the price used to come from the stored order item,
    // so a price change on the product was silently ignored on merge.
    const existingItem = buildOrderItem({
      quantity: 1,
      price: '10.00',
      product: buildProduct(),
    });
    repository.findManyByOrderIdWithProduct.mockResolvedValue([existingItem]);

    const order = buildOrder();
    const product = buildProduct({ quantity: 10, price: '20.00' });

    const result = await service.addItemToOrder(order, product, 1);

    expect(result[0].price).toBe('20.00');
    expect(result[0].subtotalAmount).toBe('40.00');
    expect(result[0].totalAmount).toBe('40.00');
  });

  it('rejects adding more units than the available stock when merging with an existing item', async () => {
    const existingItem = buildOrderItem({
      quantity: 8,
      product: buildProduct(),
    });
    repository.findManyByOrderIdWithProduct.mockResolvedValue([existingItem]);

    const order = buildOrder();
    const product = buildProduct({ quantity: 10 });

    await expect(service.addItemToOrder(order, product, 5)).rejects.toThrow(
      BadRequestException,
    );
    expect(repository.save).not.toHaveBeenCalled();
  });
});
