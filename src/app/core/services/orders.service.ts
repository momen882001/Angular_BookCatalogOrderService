import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLs } from '../api/api-urls';
import { IOrderRequest, IOrderResponse } from '../../features/orders/interfaces/OrderInterface';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private http: HttpClient) {}

  //* APIs
  placeOrder(orderRequest: IOrderRequest) {
    return this.http.post<IOrderResponse>(`${URLs.apiBaseUrl + URLs.placeOrder}`, orderRequest);
  }

  cancelOrder(orderId: number) {
    return this.http.patch<IOrderResponse>(
      `${URLs.apiBaseUrl + URLs.cancelOrder.replace(':id', orderId.toString())}`,
      {},
    );
  }

  getAllOrders() {
    return this.http.get<IOrderResponse[]>(`${URLs.apiBaseUrl + URLs.getAllOrders}`);
  }
}
