import { Component, computed, signal } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import {
  GenericTable,
  TableSearchEvent,
} from '../../../shared/components/generic-table/generic-table';
import { TableAction, TableColumn } from '../../../shared/interfaces/table-configuration-interface';

interface BookRow {
  id: number;
  title: string;
  author: string;
  genre: string;
  price: number;
  publishedAt: string;
  status: string;
}

const STATIC_BOOKS: BookRow[] = [
  {
    id: 1,
    title: 'The Silent Library',
    author: 'Elena Marquez',
    genre: 'Mystery',
    price: 18.99,
    publishedAt: '2021-03-14',
    status: 'Available',
  },
  {
    id: 2,
    title: 'Harbor of Stars',
    author: 'Noah Ellison',
    genre: 'Sci-Fi',
    price: 22.5,
    publishedAt: '2019-11-02',
    status: 'Available',
  },
  {
    id: 3,
    title: 'Paper Trails',
    author: 'Maya Chen',
    genre: 'Non-fiction',
    price: 15.0,
    publishedAt: '2023-06-21',
    status: 'Reserved',
  },
  {
    id: 4,
    title: 'Autumn Ledger',
    author: 'Owen Blake',
    genre: 'Drama',
    price: 12.75,
    publishedAt: '2018-09-08',
    status: 'Available',
  },
  {
    id: 5,
    title: 'Copper Coast',
    author: 'Sara Lind',
    genre: 'Travel',
    price: 19.4,
    publishedAt: '2020-01-30',
    status: 'Out of stock',
  },
  {
    id: 6,
    title: 'Midnight Catalog',
    author: 'James Ortiz',
    genre: 'Thriller',
    price: 21.0,
    publishedAt: '2022-12-05',
    status: 'Available',
  },
  {
    id: 7,
    title: 'Glass Atlas',
    author: 'Priya Nair',
    genre: 'Fantasy',
    price: 24.99,
    publishedAt: '2024-02-17',
    status: 'Reserved',
  },
  {
    id: 8,
    title: 'Quiet Margins',
    author: 'Helen Rowe',
    genre: 'Poetry',
    price: 11.25,
    publishedAt: '2017-05-11',
    status: 'Available',
  },
];

@Component({
  selector: 'app-books',
  imports: [GenericTable],
  templateUrl: './books.html',
  styleUrl: './books.scss',
})
export class Books {
  private readonly allBooks = signal<BookRow[]>(STATIC_BOOKS);
  private readonly searchTerm = signal('');
  private readonly pageIndex = signal(0);
  protected readonly pageSize = signal(5);

  protected readonly columns: TableColumn[] = [
    { key: 'title', header: 'Title' },
    { key: 'author', header: 'Author' },
    { key: 'genre', header: 'Genre' },
    {
      key: 'price',
      header: 'Price',
      pipe: (value) => `$${Number(value).toFixed(2)}`,
    },
    { key: 'publishedAt', header: 'Published', type: 'date' },
    { key: 'status', header: 'Status' },
  ];

  protected readonly actions: TableAction<BookRow>[] = [
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
      visible: (book) => book.status !== 'Reserved',
    },
  ];

  private readonly filteredBooks = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) {
      return this.allBooks();
    }

    return this.allBooks().filter((book) =>
      [book.title, book.author, book.genre, book.status].join(' ').toLowerCase().includes(term),
    );
  });

  protected readonly totalItems = computed(() => this.filteredBooks().length);

  protected readonly tableData = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredBooks().slice(start, start + this.pageSize()) as unknown as Record<
      string,
      unknown
    >[];
  });

  protected onSearch(event: TableSearchEvent): void {
    this.searchTerm.set(event.searchValue);
    this.pageIndex.set(0);
  }

  protected onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }
}
