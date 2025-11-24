import { Component, computed, inject } from '@angular/core';
import { Navbar } from '../../shared/navbar/navbar';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

import { Store } from '@ngrx/store';
import { selectIsLoggedIn } from '../../state/auth/auth.selectors';
import { Router, RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';

import { SubjectsActions } from '../../state/subjects/subjects.actions';
import { UsersActions } from '../../state/users/users.actions';
@Component({
  selector: 'app-store-layout',
  imports: [Navbar, IconFieldModule, InputIconModule, RouterOutlet, Toast],
  templateUrl: './dashboard-layout.html',
})
export class DashboardLayout {
  store = inject(Store);
  router = inject(Router);

  islogged = computed(() => {
    return this.store.selectSignal(selectIsLoggedIn)();
  });

  ngOnInit() {
    if (this.islogged() === false) this.router.navigate(['/auth/login']);

    this.store.dispatch(SubjectsActions.load());
    this.store.dispatch(UsersActions.load());
  }
}
