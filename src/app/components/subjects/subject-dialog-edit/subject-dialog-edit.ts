import { Component, inject } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Select } from 'primeng/select';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { SubjectsActions } from '../../../state/subjects/subjects.actions';
import { Subject } from '../../../state/subjects/subjects.models';
import { selectAllProfessors } from '../../../state/users/users.selectors';

@Component({
  selector: 'app-subject-dialog-edit',
  standalone: true,
  imports: [DialogModule, ButtonModule, ReactiveFormsModule, Select],
  templateUrl: './subject-dialog-edit.html',
})
export class SubjectDialogEdit {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  private actualSubject!: Subject;

  visible = false;
  editingSubjectId!: number;

  profesors = this.store.selectSignal(selectAllProfessors);

  editForm = this.fb.group({
    name: ['', Validators.required],
    profesorId: [null as number | null, Validators.required],
    maxPerWeek: [1, [Validators.required, Validators.min(1)]],
  });

  openEditDialog(subject: Subject) {
    this.actualSubject = subject;
    this.visible = true;
    this.editingSubjectId = subject.id;

    this.editForm.reset({
      name: subject.name,
      profesorId: subject.profesorId,
      maxPerWeek: subject.maxPerWeek,
    });
  }
  confirmEdit() {
    if (this.editForm.invalid) return;

    const form = this.editForm.value;

    const updated: Subject = {
      id: this.editingSubjectId,
      name: form.name!,
      profesorId: form.profesorId!,
      maxPerWeek: form.maxPerWeek!,
    };

    this.store.dispatch(SubjectsActions.update({ subject: updated }));
    this.visible = false;
  }
}
