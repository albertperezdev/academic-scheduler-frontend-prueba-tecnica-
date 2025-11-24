import { Component, inject, output, resource, signal } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  NgModel,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../state/auth/auth.actions';
import { LoginService } from '../../services/auth/login';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { selectIsLoggedIn } from '../../state/auth/auth.selectors';
import { AnimationFrameScheduler } from 'rxjs/internal/scheduler/AnimationFrameScheduler';

@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CardModule,
    FloatLabelModule,
    DividerModule,
    FormsModule,
  ],
  templateUrl: './login-page.html',
})
export class LoginPage {
  private loginService = inject(LoginService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  store = inject(Store);

  fb = inject(FormBuilder);

  formLogin = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.formLogin.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Formulario invalido',
      });
      return;
    }

    const { email, password } = this.formLogin.value;

    this.store.dispatch(
      AuthActions.login({ email: email!, password: password! })
    );
  }
}

export default LoginPage;
