import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

import { IOrderResponse } from '../../interfaces/OrderInterface';

@Component({
  selector: 'app-view-order',
  standalone: true,
  imports: [
    CommonModule,

    MatDialogModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './view-order.html',
  styleUrl: './view-order.scss',
})
export class ViewOrder {
  constructor(
    public dialogRef: MatDialogRef<ViewOrder>,

    @Inject(MAT_DIALOG_DATA)
    public data: IOrderResponse,
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  get itemsCount(): number {
    return this.data.orderItems.length;
  }
}
