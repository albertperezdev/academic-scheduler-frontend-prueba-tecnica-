import { Component, ViewChild, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import {
  selectAllSubjects,
  selectSubjectsWithProfessorName,
} from '../../state/subjects/subjects.selectors';
import { SubjectsActions } from '../../state/subjects/subjects.actions';

import { Subject } from '../../state/subjects/subjects.models';

import { AsyncPipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

import { SubjectDialogAdd } from '../../components/subjects/subject-dialog-add/subject-dialog-add';
import { SubjectDialogEdit } from '../../components/subjects/subject-dialog-edit/subject-dialog-edit';
import { SubjectDialogDelete } from '../../components/subjects/subject-dialog-delete/subject-dialog-delete';

@Component({
  selector: 'app-subjects-page',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    TagModule,
    SubjectDialogAdd,
    SubjectDialogEdit,
    SubjectDialogDelete,
  ],
  templateUrl: './subjects-page.html',
})
export class SubjectsPage {
  private store = inject(Store);

  constructor() {
    this.store.dispatch(SubjectsActions.load());
  }

  subjectsSignal = this.store.selectSignal(selectSubjectsWithProfessorName);

  @ViewChild(SubjectDialogAdd) addDialog!: SubjectDialogAdd;
  @ViewChild(SubjectDialogEdit) editDialog!: SubjectDialogEdit;
  @ViewChild(SubjectDialogDelete) deleteDialog!: SubjectDialogDelete;

  openAddDialog() {
    this.addDialog.showAddDialog();
  }

  openEditDialog(subject: Subject) {
    this.editDialog.openEditDialog(subject);
  }

  openDeleteDialog(subject: Subject) {
    this.deleteDialog.showDeleteDialog(subject);
  }
}

export default SubjectsPage;
