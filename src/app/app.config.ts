import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { definePreset } from '@primeng/themes';

import { routes } from './app.routes';
import { provideState, provideStore } from '@ngrx/store';
import { subjectsReducer } from './state/subjects/subjects.reducer';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { subjectsFeature } from './state/subjects/subjects.selectors';
import { scheduleFeature } from './state/schedule/schedule.selectors';
import { authFeature } from './state/auth/auth.selectors';
import { MessageService } from 'primeng/api';
import { provideEffects } from '@ngrx/effects';
import { AuthEffects } from './state/auth/auth.effects';
import { usersFeature } from './state/users/users.selectors';
import { UsersEffects } from './state/users/users.effects';
import { ScheduleEffects } from './state/schedule/schedule.effects';
import { SubjectsEffects } from './state/subjects/subjects.effects';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: definePreset(Aura, {
          semantic: {
            primary: {
              50: '{slate.50}',
              100: '{slate.100}',
              200: '{slate.200}',
              300: '{slate.300}',
              400: '{slate.400}',
              500: '{slate.500}',
              600: '{slate.600}',
              700: '{slate.700}',
              800: '{slate.800}',
              900: '{slate.900}',
            },
          },
        }),
      },
    }),
    provideStore(),
    provideState(subjectsFeature),
    provideState(scheduleFeature),
    provideState(authFeature),
    provideState(usersFeature),
    provideStoreDevtools(),
    MessageService,
    provideEffects([AuthEffects]),
    provideEffects([UsersEffects]),
    provideEffects([ScheduleEffects]),
    provideEffects([SubjectsEffects]),
  ],
};
