import { Component, inject, input, OnInit, output } from '@angular/core';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { Avatar } from 'primeng/avatar';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../interfaces/user';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../state/auth/auth.selectors';
import { AuthActions } from '../../state/auth/auth.actions';

@Component({
  selector: 'app-user-profile',
  imports: [Button, Dialog, Avatar, ReactiveFormsModule],
  templateUrl: './user-profile.html',
})
export class UserProfile implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  visible = false;
  router = inject(Router);
  user = this.store.selectSignal(selectAuthUser);

  formEdit = this.fb.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
  });

  ngOnInit() {
    const user = this.store.selectSignal(selectAuthUser);
    if (user()) {
      this.formEdit.patchValue(user()!);
    }
  }
  showDialog() {
    this.visible = true;
  }
  onSubmit() {
    console.log(this.formEdit.value);
  }
  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
