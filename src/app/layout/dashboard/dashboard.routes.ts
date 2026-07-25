import { Routes } from '@angular/router';
import { Dashboard } from './dashboard';

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
      },
      {
        path: 'users',
        loadComponent: () => import('../../features/users/components/users').then((c) => c.Users),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('../../features/orders/components/orders').then((c) => c.Orders),
      },
    ],
  },
];
