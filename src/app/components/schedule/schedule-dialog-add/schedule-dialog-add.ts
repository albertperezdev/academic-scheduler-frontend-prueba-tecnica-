import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ScheduleActions } from '../../../state/schedule/schedule.actions';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { SubjectsService } from '../../../services/subjects/subjects';
import { selectAllSubjects } from '../../../state/subjects/subjects.selectors';

@Component({
  selector: 'app-schedule-dialog-add',
  standalone: true,
  templateUrl: './schedule-dialog-add.html',
  imports: [ButtonModule, DialogModule, SelectModule, ReactiveFormsModule],
})
export class ScheduleDialogAdd {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private subjectsService = inject(SubjectsService);

  days = this.subjectsService.days;
  materias = this.store.selectSignal(selectAllSubjects);

  addVisible = false;

  addForm = this.fb.group({
    day: [null, Validators.required],
    subjectId: [null, Validators.required],
    startTime: ['', Validators.required],
    endTime: ['', Validators.required],
  });

  showAddDialog() {
    this.addVisible = true;
  }

  confirmAddClass() {
    if (this.addForm.invalid) return;

    // Bloque compatible con ScheduleEffects
    const block = {
      ...this.addForm.value,
      id: 0, // temporal — backend genera el real
      name:
        this.materias().find((m: any) => m.id === this.addForm.value.subjectId)
          ?.name ?? '',
    };

    this.store.dispatch(
      ScheduleActions.addClass({
        block: block as any,
      })
    );

    this.addVisible = false;
  }
}
