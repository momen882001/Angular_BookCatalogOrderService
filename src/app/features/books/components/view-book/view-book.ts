import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { IBookResponse } from '../../interfaces/BookInterface';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-view-book',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './view-book.html',
  styleUrl: './view-book.scss',
})
export class ViewBook {
  constructor(
    public dialogRef: MatDialogRef<ViewBook>,
    @Inject(MAT_DIALOG_DATA) public data: IBookResponse,
  ) {}
}
