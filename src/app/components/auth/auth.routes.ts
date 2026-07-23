import { Routes } from '@angular/router';
import { Auth } from './auth';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: Auth,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadComponent: () => import('./login/login').then((c) => c.Login),
      },
      {
        path: 'register',
        loadComponent: () => import('./signup/signup').then((c) => c.Signup),
      },
    ],
  },
];
