import { Routes } from '@angular/router';
import { Layout } from './layout';
import { AuthGuard } from '../core/services/auth.guard.service';

export const LAYOUT_ROUTES: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
      },
      {
        path: '',
        redirectTo: 'dashboard/books',
        pathMatch: 'full',
      },
    ],
    canActivate: [AuthGuard],
  },
];
