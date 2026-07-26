import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { IUserResponse } from '../../interfaces/UserInterface';
import { UserRoleEnum } from '../../../../shared/enums/UserRoleEnum';

@Component({
  selector: 'app-view-user',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatDialogModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './view-user.html',
  styleUrl: './view-user.scss',
})
export class ViewUser {
  readonly UserRoleEnum = UserRoleEnum;

  constructor(
    public dialogRef: MatDialogRef<ViewUser>,
    @Inject(MAT_DIALOG_DATA) public data: IUserResponse,
  ) {}

  get initials(): string {
    return (this.data.firstname.charAt(0) + this.data.lastname.charAt(0)).toUpperCase();
  }

  close(): void {
    this.dialogRef.close();
  }
}
