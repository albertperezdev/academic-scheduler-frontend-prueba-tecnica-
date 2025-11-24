import { Routes } from '@angular/router';
import { DashboardLayout } from './dashboard-layout';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardLayout,
    children: [
      {
        path: 'schedule',
        loadComponent: () => import('../../pages/schedule-page/schedule-page'),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('../../pages/users-admin-page/users-admin-page'),
      },
      {
        path: 'subjects',
        loadComponent: () => import('../../pages/subjects-page/subjects-page'),
      },

      {
        path: '**',
        redirectTo: 'schedule',
      },
    ],
  },
];
