import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NumberOnlyDirective } from '../../../shared/directives/number-only.directive';
import { Curriculum } from '../../../shared/models/curriculum';

@Component({
  selector: 'app-curriculum-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    NumberOnlyDirective,
  ],
  templateUrl: './curriculum-dialog.component.html',
  styleUrl: './curriculum-dialog.component.scss',
})
export class CurriculumDialogComponent implements OnInit {
  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;
      const controls = this.curriculumForm.controls;
      controls.uuid.setValue(this.data.uuid);
      controls.code.setValue(this.data.code);
      controls.name.setValue(this.data.name);
      controls.terms.setValue(this.data.terms);
      controls.requiredCredit.setValue(this.data.requiredCredit);
    }
  }
  isEditMode = false;

  readonly dialogRef = inject(MatDialogRef<CurriculumDialogComponent>);

  readonly data = inject<Curriculum>(MAT_DIALOG_DATA);

  curriculumForm = new FormGroup({
    uuid: new FormControl(''),
    code: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    terms: new FormControl(0, [Validators.required, Validators.min(0)]),
    requiredCredit: new FormControl(0, [Validators.required, Validators.min(0)]),
  });

  cancel(): void {
    this.dialogRef.close();
  }

  save() {
    if (this.curriculumForm.valid) {
      this.dialogRef.close(this.curriculumForm.value);
    } else {
      console.log('Error');
    }
  }
}
