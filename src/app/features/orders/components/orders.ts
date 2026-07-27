import { Component, computed, signal } from '@angular/core';
import {
  GenericTable,
  TableSearchEvent,
} from '../../../shared/components/generic-table/generic-table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { IOrderRequest, IOrderResponse } from '../interfaces/OrderInterface';
import { TableAction, TableColumn } from '../../../shared/interfaces/table-configuration-interface';
import { OrdersService } from '../../../core/services/orders.service';
import { PlaceOrder } from './place-order/place-order';
import { IBookResponse } from '../../books/interfaces/BookInterface';
import { BooksService } from '../../../core/services/books.service';
import { StorageService } from '../../../core/services/storage.service';
import { AuthService } from '../../../core/services/auth.service';
import { OrderStatusEnum } from '../../../shared/enums/OrderStatusEnum';
import { ViewOrder } from './view-order/view-order';
import { NotificationService } from '../../../core/services/notification.service';
import { SuccessMessages } from '../../../core/constants/successMessages';

@Component({
  selector: 'app-orders',
  imports: [GenericTable, MatDialogModule],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class Orders {
  private allOrders = signal<IOrderResponse[]>([]);
  private searchTerm = signal('');
  books: IBookResponse[] = [];

  constructor(
    private ordersService: OrdersService,
    public dialog: MatDialog,
    private booksService: BooksService,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {}

  protected readonly columns: TableColumn[] = [
    {
      key: 'createdBy',
      header: 'Created By',
      pipe: (createdBy: any) => createdBy.firstname + ' ' + createdBy.lastname,
    },
    { key: 'status', header: 'Status' },
    {
      key: 'orderItems',
      header: 'Total Items',
      pipe: (value: any) => value.length,
    },
    { key: 'totalAmount', header: 'Total Amount' },
    { key: 'createdAt', header: 'Created At', type: 'date' },
  ];

  protected readonly actions: TableAction<IOrderResponse>[] = [
    {
      icon: 'visibility',
      label: 'View',
      handler: (order) => this.viewOrderDetails(order),
    },
    {
      icon: 'cancel',
      label: 'Cancel',
      handler: (order) => this.cancelOrder(order),
      visible: (order) =>
        order.userId == this.authService.getUserData?.userId &&
        order.status != OrderStatusEnum.CANCELLED,
    },
  ];

  ngOnInit(): void {
    this.loadAllOrders();
    this.loadAllBooks();
  }

  loadAllOrders() {
    this.ordersService.getAllOrders().subscribe({
      next: (res) => {
        console.log(res);
        this.allOrders.set(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private readonly filteredOrders = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) {
      return this.allOrders();
    }

    return this.allOrders().filter((order) => order.status.toLowerCase().includes(term));
  });

  readonly tableData = computed(() => {
    return this.filteredOrders() as IOrderResponse[];
  });

  onSearch(event: TableSearchEvent): void {
    this.searchTerm.set(event.searchValue);
  }

  openPlaceOrder(): void {
    const dialog = this.dialog.open(PlaceOrder, {
      maxWidth: '900px',
      maxHeight: '85vh',
      data: this.books,
    });

    dialog.afterClosed().subscribe((orderReq: IOrderRequest) => {
      if (orderReq) {
        this.ordersService.placeOrder(orderReq).subscribe({
          next: (res) => {
            console.log(res);
            this.notificationService.success(SuccessMessages.orderPlaced);
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => {
            this.loadAllOrders();
          },
        });
      }
    });
  }

  cancelOrder(order: IOrderResponse) {
    this.ordersService.cancelOrder(order.id).subscribe({
      next: (res) => {
        console.log(res);
        this.notificationService.success(SuccessMessages.orderCancelled);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.loadAllOrders();
      },
    });
  }

  viewOrderDetails(order: IOrderResponse): void {
    this.dialog.open(ViewOrder, {
      data: order,
      maxWidth: '750px',
      maxHeight: '85vh',
      autoFocus: false,
    });
  }

  private loadAllBooks(): void {
    this.booksService.getAllBooks().subscribe({
      next: (res) => {
        if (res) {
          this.books = res;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
