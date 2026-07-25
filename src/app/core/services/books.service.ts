import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLs } from '../api/api-urls';
import { IBookResponse } from '../../features/books/interfaces/BookInterface';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  constructor(private http: HttpClient) {}

  //* APIs
  getAllBooks() {
    return this.http.get<IBookResponse[]>(`${URLs.apiBaseUrl + URLs.getAllBooks}`);
  }
}
