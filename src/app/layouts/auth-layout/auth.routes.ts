import { Routes } from '@angular/router';
import { AuthLayout } from './auth-layout';
import LoginPage from '../../pages/login-page/login-page';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        loadComponent: () => import('../../pages/login-page/login-page'),
      },
      // register route removed — application uses only login
      {
        path: '**',
        redirectTo: 'login',
      },
    ],
  },
];
