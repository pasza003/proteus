import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NumberOnlyDirective } from '../../../shared/directives/number-only.directive';
import { RequirementType, RequirementTypeMap, SignupTypeMap, SignupTypes, Subject } from '../../../shared/models/subject';

@Component({
  selector: 'app-subject-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    ReactiveFormsModule,
    NumberOnlyDirective,
    MatSelectModule,
  ],
  templateUrl: './subject-dialog.component.html',
  styleUrl: './subject-dialog.component.scss',
})
export class SubjectDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<SubjectDialogComponent>);
  private readonly data = inject<Subject>(MAT_DIALOG_DATA);

  public isEditMode = false;
  public readonly signupTypes: SignupTypes[] = Object.values(SignupTypeMap);
  public readonly requirementTypes: RequirementType[] = Object.values(RequirementTypeMap);
  public readonly subjectForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    code: new FormControl('', [Validators.required]),
    signupType: new FormControl('', [Validators.required]),
    requirementType: new FormControl('', [Validators.required]),
    interiorOrganization: new FormControl('', [Validators.required]),
    recommendedTerm: new FormControl(0, [Validators.required]),
    credit: new FormControl(0, [Validators.required]),
  });

  public ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;
      const controls = this.subjectForm.controls;
      controls.id.setValue(this.data.id);
      controls.name.setValue(this.data.name);
      controls.code.setValue(this.data.code);
      controls.signupType.setValue(this.data.signupType);
      controls.requirementType.setValue(this.data.requirementType);
      controls.interiorOrganization.setValue(this.data.interiorOrganization);
      controls.recommendedTerm.setValue(this.data.recommendedTerm);
      controls.credit.setValue(this.data.credit);
    }
  }

  public cancel(): void {
    this.dialogRef.close();
  }

  public save(): void {
    if (this.subjectForm.valid) {
      this.dialogRef.close(this.subjectForm.value);
    }
  }
}
