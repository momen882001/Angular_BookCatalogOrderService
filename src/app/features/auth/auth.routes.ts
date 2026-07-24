import { Routes } from '@angular/router';
import { Auth } from './components/auth';

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
        loadComponent: () => import('./components/login/login').then((c) => c.Login),
      },
      {
        path: 'register',
        loadComponent: () => import('./components/signup/signup').then((c) => c.Signup),
      },
    ],
  },
];
