import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ScheduleActions } from '../../../state/schedule/schedule.actions';
import { selectScheduleWithSubjectsForUser } from '../../../state/schedule/schedule.selectors';
import { selectAuthUser } from '../../../state/auth/auth.selectors';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-schedule-dialog-delete',
  standalone: true,
  imports: [DialogModule, ButtonModule, Select, ReactiveFormsModule],
  templateUrl: './schedule-dialog-delete.html',
})
export class ScheduleDialogDelete {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  deleteVisible = false;

  user = this.store.selectSignal(selectAuthUser);
  scheduleSignal = this.store.selectSignal(
    selectScheduleWithSubjectsForUser(this.user()!.id)
  );

  get blockOptions() {
    return (
      this.scheduleSignal()?.map((b: any, index: number) => ({
        label: `${b.dia} - ${b.asignatura}`,
        index,
      })) ?? []
    );
  }

  deleteForm = this.fb.group({
    index: [null as number | null, Validators.required],
  });

  showDeleteDialog() {
    this.deleteForm.reset();
    this.deleteVisible = true;
  }

  confirmDeleteClass() {
    if (this.deleteForm.invalid) return;

    this.store.dispatch(
      ScheduleActions.removeClass({
        index: this.deleteForm.value.index!,
      })
    );

    this.deleteVisible = false;
  }
}
