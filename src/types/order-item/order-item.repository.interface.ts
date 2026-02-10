import { OrderItem } from 'src/entities/order-item.entity';
import { IBaseTypeormRepository } from '../base-typeorm.repository.interface';

export abstract class IOrderItemRepository extends IBaseTypeormRepository<OrderItem> {}
