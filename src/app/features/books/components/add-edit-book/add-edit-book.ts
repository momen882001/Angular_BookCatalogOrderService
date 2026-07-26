import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { IBookRequest, IBookResponse } from '../../interfaces/BookInterface';

@Component({
  selector: 'app-add-edit-book',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatDialogModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,

    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './add-edit-book.html',
  styleUrl: './add-edit-book.scss',
})
export class AddEditBook implements OnInit {
  bookForm!: FormGroup;

  isEditMode = false;

  constructor(
    private fb: FormBuilder,

    public dialogRef: MatDialogRef<AddEditBook>,

    @Inject(MAT_DIALOG_DATA)
    public data?: IBookResponse,
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data;

    this.initializeForm();

    if (this.isEditMode) {
      this.patchEditData();
      this.disableEditFields();
    }
  }

  private initializeForm(): void {
    this.bookForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],

      isbn: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(20)]],

      author: ['', [Validators.required, Validators.maxLength(150)]],

      price: [null, [Validators.required, Validators.min(0.01)]],

      availableQuantity: [null, [Validators.required, Validators.min(0)]],
    });
  }

  private patchEditData(): void {
    this.bookForm.patchValue({
      title: this.data?.title,

      isbn: this.data?.isbn,

      author: this.data?.author,

      price: this.data?.price,

      availableQuantity: this.data?.availableQuantity,
    });
  }

  private disableEditFields(): void {
    this.bookForm.get('title')?.disable();

    this.bookForm.get('isbn')?.disable();

    this.bookForm.get('author')?.disable();
  }

  submit(): void {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      return;
    }
    const request: IBookRequest = this.bookForm.getRawValue();
    this.dialogRef.close(request);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  get title() {
    return this.bookForm.get('title');
  }

  get isbn() {
    return this.bookForm.get('isbn');
  }

  get author() {
    return this.bookForm.get('author');
  }

  get price() {
    return this.bookForm.get('price');
  }

  get availableQuantity() {
    return this.bookForm.get('availableQuantity');
  }
}
