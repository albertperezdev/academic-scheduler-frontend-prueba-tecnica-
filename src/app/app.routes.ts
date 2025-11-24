import { Routes } from '@angular/router';
import { AUTH_ROUTES } from './layouts/auth-layout/auth.routes';
import { DASHBOARD_ROUTES } from './layouts/dashboard-layout/dashboard.routes';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => AUTH_ROUTES,
  },
  {
    path: 'dashboard',
    loadChildren: () => DASHBOARD_ROUTES,
  },

  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
