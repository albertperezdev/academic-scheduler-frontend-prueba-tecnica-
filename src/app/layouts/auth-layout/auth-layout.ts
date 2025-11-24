import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Store } from '@ngrx/store';
import { UsersActions } from '../../state/users/users.actions';
@Component({
  selector: 'app-auth-layout',
  imports: [ButtonModule, RouterOutlet, CardModule, Toast],
  providers: [MessageService],
  templateUrl: './auth-layout.html',
})
export class AuthLayout {
  private store = inject(Store);

  ngOnInit(): void {
    // Al cargar el layout de autenticación, precargar los usuarios desde el backend
    this.store.dispatch(UsersActions.load());
  }
}
