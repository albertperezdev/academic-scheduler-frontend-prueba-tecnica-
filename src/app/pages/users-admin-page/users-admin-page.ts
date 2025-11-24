import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import /*LoginService removed - use effects via store*/ '../../services/auth/login';
import { User } from '../../interfaces/user';
import { ROLES } from '../../constants/roles';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Store, on } from '@ngrx/store';
import { UsersActions } from '../../state/users/users.actions';
import { selectAllUsers } from '../../state/users/users.selectors';
import { AsyncPipe } from '@angular/common';
import { take } from 'rxjs';
import { selectAuthUser } from '../../state/auth/auth.selectors';
import { Router } from '@angular/router';
import { AuthActions } from '../../state/auth/auth.actions';

@Component({
  selector: 'app-users-admin-page',
  imports: [
    TableModule,
    TagModule,
    ButtonModule,
    DialogModule,
    SelectModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  templateUrl: './users-admin-page.html',
})
export class UsersAdminPage implements OnInit {
  // no direct service injection; effects handle backend calls
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private store = inject(Store);
  private router = inject(Router);

  usuarios$ = this.store.select(selectAllUsers);
  roles = ROLES;

  visibleCreate: any;
  visibleEdit: any;
  selectedUser!: User;

  FormAdd = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
    role: [null, [Validators.required]],
  });

  FormEdit = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
    role: ['', Validators.required],
  });

  ngOnInit() {
    this.store.dispatch(UsersActions.load());

    this.store
      .select(selectAuthUser)
      .pipe(take(1))
      .subscribe((user) => {
        if (!user || user.role !== 'admin') {
          this.messageService.add({
            severity: 'info',
            summary: 'Sin permisos de administrador',
            detail: `El usuario ${user?.name} no tiene permisos para acceder a esta sección.`,
          });
          this.router.navigate(['/dashboard']);
        }
      });
  }

  crearUsuario() {
    if (this.FormAdd.invalid) return;
    const { email, name, password, role } = this.FormAdd.value;
    const newUser: User = {
      id: 0,
      email: email!,
      name: name!,
      password: password!,
      role: role!,
      active: true,
    } as User;

    this.store.dispatch(UsersActions.add({ user: newUser }));
    this.visibleCreate = false;
    this.FormAdd.reset();
  }
  deleteUser(user: User) {
    this.store.dispatch(UsersActions.delete({ id: user.id }));
    this.messageService.add({
      severity: 'success',
      summary: 'Eliminado',
      detail: 'El usuario ha sido eliminado correctamente',
    });
  }

  editarUsuario(user: User) {
    this.selectedUser = user;
    this.FormEdit.patchValue(user);
    this.visibleEdit = true;
  }
  actualizarUsuario() {
    if (this.FormEdit.invalid) return;
    // Asegura que el objeto tenga el `id` del usuario seleccionado
    const updatedUser = {
      ...this.FormEdit.value,
      id: this.selectedUser.id,
    } as User;

    this.store.dispatch(UsersActions.update({ user: updatedUser }));
    this.visibleEdit = false;
  }
}

export default UsersAdminPage;
