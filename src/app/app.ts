import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LoginService } from './services/auth/login';
import { Store } from '@ngrx/store';
import { AuthActions } from './state/auth/auth.actions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  providers: [MessageService],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('crud');
  msg = inject(MessageService);
  private loginService = inject(LoginService);
  private router = inject(Router);
  private store = inject(Store);

  show() {
    this.msg.add({
      severity: 'success',
      summary: 'Funciona',
      detail: 'Toast global funcionando',
    });
  }
  ngOnInit() {
    this.store.dispatch(AuthActions.hydrate());
  }
}
