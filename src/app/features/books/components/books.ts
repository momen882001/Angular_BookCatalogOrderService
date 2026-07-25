import { Component, computed, OnInit, signal } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import {
  GenericTable,
  TableSearchEvent,
} from '../../../shared/components/generic-table/generic-table';
import { TableAction, TableColumn } from '../../../shared/interfaces/table-configuration-interface';
import { BooksService } from '../../../core/services/books.service';
import { IBookResponse } from '../interfaces/BookInterface';

@Component({
  selector: 'app-books',
  imports: [GenericTable],
  templateUrl: './books.html',
  styleUrl: './books.scss',
})
export class Books implements OnInit {
  private allBooks = signal<IBookResponse[]>([]);
  private searchTerm = signal('');

  protected readonly columns: TableColumn[] = [
    { key: 'title', header: 'Title' },
    { key: 'isbn', header: 'ISBN' },
    { key: 'author', header: 'Author' },
    {
      key: 'price',
      header: 'Price',
      pipe: (value) => `$${Number(value).toFixed(2)}`,
    },
    { key: 'availableQuantity', header: 'Quantity' },
    { key: 'createdAt', header: 'Created At', type: 'date' },
  ];

  protected readonly actions: TableAction<IBookResponse>[] = [
    {
      icon: 'visibility',
      label: 'View',
      handler: (book) => console.log('View book', book),
    },
    {
      icon: 'edit',
      label: 'Edit',
      handler: (book) => console.log('Edit book', book),
    },
    {
      icon: 'delete',
      label: 'Delete',
      handler: (book) => console.log('Delete book', book),
    },
  ];

  constructor(private booksService: BooksService) {}

  ngOnInit(): void {
    this.loadAllBooks();
  }

  loadAllBooks() {
    this.booksService.getAllBooks().subscribe({
      next: (res) => {
        console.log(res);
        this.allBooks.set(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private readonly filteredBooks = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) {
      return this.allBooks();
    }

    return this.allBooks().filter((book) => book.title.toLowerCase().includes(term));
  });

  protected readonly tableData = computed(() => {
    return this.filteredBooks() as IBookResponse[];
  });

  protected onSearch(event: TableSearchEvent): void {
    this.searchTerm.set(event.searchValue);
  }
}
