import { IBookResponse } from '../../books/interfaces/BookInterface';

export interface IOrderItemResponse {
  id: number;
  orderID: number;
  bookId: number;
  quantity: number;
  unitPrice: number;
  subTotal: number;
  book: IBookResponse;
}

export interface IOrderItemRequest {
  bookId: number;
  quantity: number;
}
