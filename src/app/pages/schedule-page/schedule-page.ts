// src/app/pages/schedule/schedule-page.ts
import { Component, ViewChild, inject, computed, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import {
  selectScheduleByUserId,
  selectScheduleWithSubjectsForUser,
} from '../../state/schedule/schedule.selectors';

import {
  selectAuthUser,
  selectIsLoggedIn,
} from '../../state/auth/auth.selectors';
import { ScheduleActions } from '../../state/schedule/schedule.actions';

import { ScheduleDialogAdd } from '../../components/schedule/schedule-dialog-add/schedule-dialog-add';
import { ScheduleDialogEdit } from '../../components/schedule/schedule-dialog-edit/schedule-dialog-edit';
import { ScheduleDialogDelete } from '../../components/schedule/schedule-dialog-delete/schedule-dialog-delete';

import { Toast } from 'primeng/toast';
import { Card } from 'primeng/card';
import { SpeedDial } from 'primeng/speeddial';
import { ScrollPanel } from 'primeng/scrollpanel';

@Component({
  selector: 'app-schedule-page',
  standalone: true,
  imports: [
    Card,
    SpeedDial,
    Toast,
    ScrollPanel,
    ScheduleDialogAdd,
    ScheduleDialogEdit,
    ScheduleDialogDelete,
  ],
  templateUrl: './schedule-page.html',
})
export class SchedulePage implements OnInit {
  private store = inject(Store);

  @ViewChild(ScheduleDialogAdd) addDialog!: ScheduleDialogAdd;
  @ViewChild(ScheduleDialogEdit) editDialog!: ScheduleDialogEdit;
  @ViewChild(ScheduleDialogDelete) deleteDialog!: ScheduleDialogDelete;

  userSignal = this.store.selectSignal(selectAuthUser);
  isLoggedSignal = this.store.selectSignal(selectIsLoggedIn);

  dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];

  scheduleRaw = computed(() => {
    const user = this.userSignal();
    return user
      ? this.store.selectSignal(selectScheduleByUserId(user.id))()
      : null;
  });

  scheduleForUser = computed(() => {
    const user = this.userSignal();
    if (!user) return null;
    return this.store.selectSignal(
      selectScheduleWithSubjectsForUser(user.id)
    )();
  });

  ngOnInit() {
    const user = this.userSignal();
    if (user) {
      this.store.dispatch(ScheduleActions.load({ userId: user.id }));
    }
  }

  getEventosPorDia(horario: any[], dia: string) {
    return horario.filter((h) => h.dia === dia);
  }

  onAdd() {
    this.addDialog.addVisible = true;
  }

  openEditFromSpeedDial() {
    const schedule = this.scheduleRaw();
    if (!schedule || !schedule.blocks.length) return;
    this.editDialog.openEditDialog();
  }

  openDeleteFromSpeedDial() {
    const schedule = this.scheduleRaw();
    if (!schedule || !schedule.blocks.length) return;
    this.deleteDialog.showDeleteDialog();
  }
  actions = [
    {
      label: 'Agregar clase',
      icon: 'pi pi-plus',
      command: () => this.onAdd(),
    },
    {
      label: 'Editar',
      icon: 'pi pi-pencil',
      command: () => this.openEditFromSpeedDial(),
    },
    {
      label: 'Eliminar',
      icon: 'pi pi-trash',
      command: () => this.openDeleteFromSpeedDial(),
    },
  ];
}

export default SchedulePage;
