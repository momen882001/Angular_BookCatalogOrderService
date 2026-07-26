import { Component, computed, signal } from '@angular/core';
import {
  GenericTable,
  TableSearchEvent,
} from '../../../shared/components/generic-table/generic-table';
import { IUserResponse } from '../interfaces/UserInterface';
import { TableAction, TableColumn } from '../../../shared/interfaces/table-configuration-interface';
import { UsersService } from '../../../core/services/users.service';
import { ViewUser } from './view-user/view-user';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-users',
  imports: [GenericTable, MatDialogModule],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users {
  private allUsers = signal<IUserResponse[]>([]);
  private searchTerm = signal('');

  protected readonly columns: TableColumn[] = [
    { key: 'firstname', header: 'Firstname' },
    { key: 'lastname', header: 'Lastname' },
    { key: 'username', header: 'Username' },
    { key: 'role', header: 'Role' },
    { key: 'createdAt', header: 'Created At', type: 'date' },
  ];

  protected readonly actions: TableAction<IUserResponse>[] = [
    {
      icon: 'visibility',
      label: 'View',
      handler: (user) => this.viewUserDetails(user),
    },
    // {
    //   icon: 'delete',
    //   label: 'Delete',
    //   handler: (book) => console.log('Delete book', book),
    // },
  ];

  constructor(
    private usersService: UsersService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadAllUsers();
  }

  loadAllUsers() {
    this.usersService.getAllUsers().subscribe({
      next: (res) => {
        console.log(res);
        this.allUsers.set(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private readonly filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) {
      return this.allUsers();
    }

    return this.allUsers().filter((user) =>
      [user.firstname, user.lastname, user.username].join('').toLowerCase().includes(term),
    );
  });

  readonly tableData = computed(() => {
    return this.filteredUsers() as IUserResponse[];
  });

  onSearch(event: TableSearchEvent): void {
    this.searchTerm.set(event.searchValue);
  }

  viewUserDetails(user: IUserResponse): void {
    this.dialog.open(ViewUser, {
      data: user,
      maxWidth: '750px',
      maxHeight: '85vh',
      // panelClass: 'user-dialog',
      autoFocus: false,
    });
  }
}
