import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Subject } from '../../shared/models/subject';
import { SubjectService } from '../../shared/services/subject.service';
import { SubjectDialogComponent } from './subject-dialog/subject-dialog.component';

@Component({
  selector: 'app-subject',
  imports: [MatTableModule, MatButtonModule, MatIcon],
  templateUrl: './subject.component.html',
  styleUrl: './subject.component.scss',
})
export class SubjectComponent {
  private readonly dialog = inject(MatDialog);

  public readonly displayedColumns: string[] = [
    'name',
    'code',
    'signupType',
    'requirementType',
    'interiorOrganization',
    'recommendedTerm',
    'credit',
    'actions',
  ];
  public readonly subjects: Signal<Subject[]>;

  constructor(private readonly subjectService: SubjectService) {
    this.subjects = toSignal(this.subjectService.subjects$, { initialValue: [] });
  }

  public openCreateSubjectDialog(): void {
    const dialogRef = this.dialog.open(SubjectDialogComponent);

    dialogRef.afterClosed().subscribe((result: Subject | undefined) => {
      if (result) {
        this.subjectService.create(result);
      }
    });
  }

  public openEditSubjectDialog(data: Subject): void {
    const dialogRef = this.dialog.open(SubjectDialogComponent, { data });

    dialogRef.afterClosed().subscribe((result: Subject | undefined) => {
      if (result) {
        this.subjectService.update(result);
      }
    });
  }

  public delete(row: Subject): void {
    this.subjectService.delete(row.id);
  }
}
