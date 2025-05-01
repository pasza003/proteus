import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Organisation } from '../../../shared/models/organisation';

@Component({
  selector: 'app-organisation-dialog',
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './organisation-dialog.component.html',
  styleUrl: './organisation-dialog.component.scss',
})
export class OrganisationDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<OrganisationDialogComponent>);
  private readonly data = inject<Organisation>(MAT_DIALOG_DATA);

  public isEditMode = false;
  public readonly organisationForm = new FormGroup({
    id: new FormControl(''),
    code: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    omCode: new FormControl('', [Validators.required]),
    postCode: new FormControl('', [Validators.required]),
    street: new FormControl('', [Validators.required]),
  });

  public ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;
      const controls = this.organisationForm.controls;
      controls.id.setValue(this.data.id);
      controls.code.setValue(this.data.code);
      controls.city.setValue(this.data.city);
      controls.name.setValue(this.data.name);
      controls.omCode.setValue(this.data.omCode);
      controls.postCode.setValue(this.data.postCode);
      controls.street.setValue(this.data.street);
    }
  }

  public cancel(): void {
    this.dialogRef.close();
  }

  public save(): void {
    if (this.organisationForm.valid) {
      this.dialogRef.close(this.organisationForm.value);
    }
  }
}
