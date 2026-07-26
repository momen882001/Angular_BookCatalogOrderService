import { IUserResponse } from '../../users/interfaces/UserInterface';

export interface IBookRequest {
  title: string;
  isbn: string;
  author: string;
  price: number;
  availableQuantity: number;
}

export interface IUpdateBookRequest {
  price: number;
  availableQuantity: number;
}

export interface IBookResponse {
  id: number;
  title: string;
  isbn: string;
  author: string;
  price: number;
  availableQuantity: number;
  createdAt: string;
  updatedAt: string;
  createdBy: IUserResponse;
}
