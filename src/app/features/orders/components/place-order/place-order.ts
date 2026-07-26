import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';

import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { IBookResponse } from '../../../books/interfaces/BookInterface';
import { IOrderRequest } from '../../interfaces/OrderInterface';

@Component({
  selector: 'app-place-order',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatDialogModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,

    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './place-order.html',
  styleUrl: './place-order.scss',
})
export class PlaceOrder implements OnInit {
  orderForm!: FormGroup;

  constructor(
    private fb: FormBuilder,

    public dialogRef: MatDialogRef<PlaceOrder>,

    @Inject(MAT_DIALOG_DATA)
    public books: IBookResponse[],
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    this.addOrderItem();
  }

  private initializeForm(): void {
    this.orderForm = this.fb.group({
      orderItems: this.fb.array([]),
    });
  }

  get orderItems(): FormArray {
    return this.orderForm.get('orderItems') as FormArray;
  }

  createOrderItem(): FormGroup {
    return this.fb.group({
      bookId: [null, [Validators.required, Validators.min(1)]],

      quantity: [1, [Validators.required, Validators.min(1), this.quantityValidator.bind(this)]],
    });
  }

  addOrderItem(): void {
    this.orderItems.push(this.createOrderItem());
  }

  removeOrderItem(index: number): void {
    this.orderItems.removeAt(index);

    if (this.orderItems.length === 0) {
      this.addOrderItem();
    }
  }

  isBookSelected(bookId: number): boolean {
    return this.orderItems.controls.some((item) => item.value.bookId === bookId);
  }

  getBook(bookId: number) {
    return this.books.find((book) => book.id === bookId);
  }

  get selectedItems() {
    return this.orderItems.controls
      .map((item) => {
        const bookId = item.value.bookId;

        const book = this.getBook(bookId);

        if (!book) {
          return null;
        }

        return {
          title: book.title,

          author: book.author,

          quantity: item.value.quantity,

          unitPrice: book.price,

          subtotal: book.price * item.value.quantity,
        };
      })
      .filter((item) => item !== null);
  }

  get totalAmount(): number {
    return this.selectedItems.reduce(
      (total, item) => {
        return total + item.subtotal;
      },

      0,
    );
  }

  onBookChange(item: AbstractControl): void {
    item.get('quantity')?.updateValueAndValidity();
  }

  private quantityValidator(control: AbstractControl): ValidationErrors | null {
    const quantity = control.value;

    const bookId = control.parent?.get('bookId')?.value;

    if (!bookId || !quantity) {
      return null;
    }

    const selectedBook = this.getBook(bookId);

    if (!selectedBook) {
      return null;
    }

    if (quantity > selectedBook.availableQuantity) {
      return {
        exceedsStock: {
          availableQuantity: selectedBook.availableQuantity,
        },
      };
    }

    return null;
  }

  submit(): void {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();

      return;
    }

    const orderRequest: IOrderRequest = {
      orderItems: this.orderForm.value.orderItems,
    };

    this.dialogRef.close(orderRequest);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
