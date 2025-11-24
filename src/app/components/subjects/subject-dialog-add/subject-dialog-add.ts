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
  selector: 'app-subject-dialog-add',
  standalone: true,
  imports: [DialogModule, ButtonModule, ReactiveFormsModule, Select],
  templateUrl: './subject-dialog-add.html',
})
export class SubjectDialogAdd {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  profesors = this.store.selectSignal(selectAllProfessors);

  visible = false;

  addForm = this.fb.group({
    name: ['', Validators.required],
    profesorId: [null, Validators.required],
    maxPerWeek: [1, [Validators.required, Validators.min(1)]],
  });

  showAddDialog() {
    this.visible = true;
    this.addForm.reset({ maxPerWeek: 1 });
  }

  confirmAdd() {
    if (this.addForm.invalid) return;

    const form = this.addForm.value;

    const payload = {
      name: form.name!,
      profesorId: form.profesorId!,
      maxPerWeek: form.maxPerWeek ?? 1,
    };

    this.store.dispatch(SubjectsActions.create({ subject: payload } as any));
    this.visible = false;
  }
}
