import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { ScheduleActions } from '../../../state/schedule/schedule.actions';
import { ScheduleBlock } from '../../../state/schedule/schedule.models';
import { Subject } from '../../../state/subjects/subjects.models';

import { Select } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

import { SubjectsService } from '../../../services/subjects/subjects';
import { selectAllSubjects } from '../../../state/subjects/subjects.selectors';
import { selectScheduleByUserId } from '../../../state/schedule/schedule.selectors';
import { selectAuthUser } from '../../../state/auth/auth.selectors';

@Component({
  selector: 'app-schedule-dialog-edit',
  standalone: true,
  imports: [DialogModule, ButtonModule, Select, ReactiveFormsModule],
  templateUrl: './schedule-dialog-edit.html',
})
export class ScheduleDialogEdit {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private subjectsService = inject(SubjectsService);

  editVisible = false;

  days = this.subjectsService.days;
  materias = this.store.selectSignal(selectAllSubjects);

  currentIndex: number | null = null;

  scheduleSignal = this.store.selectSignal(
    selectScheduleByUserId(this.store.selectSignal(selectAuthUser)()!.id)
  );

  get blockOptions() {
    const sched = this.scheduleSignal();
    if (!sched) return [];
    return sched.blocks.map((b, i) => ({
      index: i,
      label: `${b.day} — ${b.startTime} a ${b.endTime}`,
    }));
  }

  formEdit = this.fb.group({
    day: [null as string | null, Validators.required],
    subjectId: [null as number | null, Validators.required],
    startTime: ['', Validators.required],
    endTime: ['', Validators.required],
  });

  openEditDialog() {
    this.editVisible = true;
    this.currentIndex = null;
    this.formEdit.reset();
  }

  onSelectBlock(index: number) {
    this.currentIndex = index;

    const block = this.scheduleSignal()!.blocks[index];

    this.formEdit.patchValue({
      day: block.day,
      subjectId: block.subjectId,
      startTime: block.startTime,
      endTime: block.endTime,
    });
  }

  confirmEditClass() {
    if (this.formEdit.invalid || this.currentIndex === null) return;

    const raw = this.formEdit.value;
    const original = this.scheduleSignal()!.blocks[this.currentIndex];

    const updatedBlock: ScheduleBlock = {
      id: original.id, // <-- ID REAL DE LA BD
      day: raw.day!,
      subjectId: raw.subjectId!,
      name:
        this.materias().find((m: Subject) => m.id === raw.subjectId)?.name ??
        '',
      startTime: raw.startTime!,
      endTime: raw.endTime!,
    };

    this.store.dispatch(
      ScheduleActions.editClass({
        index: this.currentIndex,
        block: updatedBlock,
      })
    );

    this.editVisible = false;
  }
}
