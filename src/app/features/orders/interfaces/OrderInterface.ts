import { OrderStatusEnum } from '../../../shared/enums/OrderStatusEnum';
import { IOrderItemRequest, IOrderItemResponse } from './OrderItemInterface';

export interface IOrderRequest {
  orderItems: IOrderItemRequest[];
}

export interface IOrderResponse {
  id: number;
  userId: number;
  totalAmount: number;
  orderItems: IOrderItemResponse[];
  createdAt: string;
  status: OrderStatusEnum;
}
