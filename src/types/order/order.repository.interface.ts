import { Order } from 'src/entities/order.entity';
import { IBaseTypeormRepository } from '../base-typeorm.repository.interface';

export abstract class IOrderRepository extends IBaseTypeormRepository<Order> {}
