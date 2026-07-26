import { UserRoleEnum } from './../../../shared/enums/UserRoleEnum';
import { Component, computed, OnInit, signal } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import {
  GenericTable,
  TableSearchEvent,
} from '../../../shared/components/generic-table/generic-table';
import { TableAction, TableColumn } from '../../../shared/interfaces/table-configuration-interface';
import { BooksService } from '../../../core/services/books.service';
import { IBookRequest, IBookResponse } from '../interfaces/BookInterface';
import { ViewBook } from './view-book/view-book';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddEditBook } from './add-edit-book/add-edit-book';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SuccessMessages } from '../../../core/constants/successMessages';

@Component({
  selector: 'app-books',
  imports: [GenericTable, MatDialogModule],
  templateUrl: './books.html',
  styleUrl: './books.scss',
})
export class Books implements OnInit {
  private allBooks = signal<IBookResponse[]>([]);
  private searchTerm = signal('');

  constructor(
    private booksService: BooksService,
    public dialog: MatDialog,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {}

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
      handler: (book) => this.viewBookDetails(book),
    },
    {
      icon: 'edit',
      label: 'Edit',
      handler: (book) => this.editBook(book),
      visible: () => this.isUserAdmin(),
    },
    // {
    //   icon: 'delete',
    //   label: 'Delete',
    //   handler: (book) => console.log('Delete book', book),
    // },
  ];

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

  readonly tableData = computed(() => {
    return this.filteredBooks() as IBookResponse[];
  });

  onSearch(event: TableSearchEvent): void {
    this.searchTerm.set(event.searchValue);
  }

  isUserAdmin(): boolean {
    return this.authService.getUserData?.role === UserRoleEnum.ADMIN;
  }

  viewBookDetails(book: IBookResponse): void {
    this.dialog.open(ViewBook, {
      data: book,
      maxWidth: '750px',
      maxHeight: '85vh',
      panelClass: 'book-dialog',
      autoFocus: false,
    });
  }

  openAddBook() {
    const dialog = this.dialog.open(AddEditBook, {
      maxWidth: '750px',
      maxHeight: '85vh',
      autoFocus: false,
    });

    dialog.afterClosed().subscribe((result: IBookRequest) => {
      if (result) {
        console.log(result);
        this.booksService.createBook(result).subscribe({
          next: (res) => {
            console.log(res, 'create book res');
            this.notificationService.success(SuccessMessages.bookCreated);
          },
          error: (err: any) => {
            console.log(err);
          },
          complete: () => {
            this.loadAllBooks();
          },
        });
      }
    });
  }

  editBook(book: IBookResponse) {
    const dialog = this.dialog.open(AddEditBook, {
      data: book,
      maxWidth: '750px',
      maxHeight: '85vh',
      autoFocus: false,
    });

    dialog.afterClosed().subscribe((result: IBookRequest) => {
      if (result) {
        console.log(result);
        const bookReqData = {
          price: result.price,
          availableQuantity: result.availableQuantity,
        };
        this.booksService.updateBook(bookReqData, book.id).subscribe({
          next: (res) => {
            console.log(res, 'update book res');
            this.notificationService.success(SuccessMessages.bookUpdated);
          },
          error: (err: any) => {
            console.log(err);
          },
          complete: () => {
            this.loadAllBooks();
          },
        });
      }
    });
  }
}
