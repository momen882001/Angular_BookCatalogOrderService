import { Routes } from '@angular/router';
import { Dashboard } from './dashboard';
import { AuthGuard } from '../../core/services/auth.guard.service';
import { UserRoleEnum } from '../../shared/enums/UserRoleEnum';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: Dashboard,
    children: [
      {
        path: '',
        redirectTo: 'books',
        pathMatch: 'full',
      },
      {
        path: 'books',
        loadComponent: () => import('../../features/books/components/books').then((c) => c.Books),
        canActivate: [AuthGuard],
      },
      {
        path: 'users',
        loadComponent: () => import('../../features/users/components/users').then((c) => c.Users),
        canActivate: [AuthGuard],

        data: {
          roles: [UserRoleEnum.ADMIN],
        },
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('../../features/orders/components/orders').then((c) => c.Orders),
        canActivate: [AuthGuard],
      },
    ],
  },
];
