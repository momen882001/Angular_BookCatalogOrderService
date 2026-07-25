import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLs } from '../api/api-urls';
import {
  IBookRequest,
  IBookResponse,
  IUpdateBookRequest,
} from '../../features/books/interfaces/BookInterface';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  constructor(private http: HttpClient) {}

  //* APIs

  createBook(book: IBookRequest) {
    return this.http.post<IBookResponse>(URLs.apiBaseUrl + URLs.createBook, book);
  }

  updateBook(book: IUpdateBookRequest, bookId: number) {
    return this.http.patch<IBookResponse>(
      URLs.apiBaseUrl + URLs.updateBook.replace(':id', bookId.toString()),
      book,
    );
  }

  getAllBooks() {
    return this.http.get<IBookResponse[]>(`${URLs.apiBaseUrl + URLs.getAllBooks}`);
  }
}
