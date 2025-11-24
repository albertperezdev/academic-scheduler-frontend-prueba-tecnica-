import { Component, inject } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Store } from '@ngrx/store';

import { Subject } from '../../../state/subjects/subjects.models';
import { SubjectsActions } from '../../../state/subjects/subjects.actions';

@Component({
  selector: 'app-subject-dialog-delete',
  standalone: true,
  imports: [DialogModule, ButtonModule],
  templateUrl: './subject-dialog-delete.html',
})
export class SubjectDialogDelete {
  private store = inject(Store);

  visible = false;
  subjectToDelete!: Subject;

  showDeleteDialog(subject: Subject) {
    this.visible = true;
    this.subjectToDelete = subject;
  }

  confirmDelete() {
    this.store.dispatch(
      SubjectsActions.delete({ id: this.subjectToDelete.id })
    );
    this.visible = false;
  }
}
