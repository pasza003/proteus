import { Component, inject, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Subject } from '../../shared/models/subject';
import { SubjectDialogComponent } from './subject-dialog/subject-dialog.component';
import { SubjectService } from '../../shared/services/subject.service';

@Component({
    selector: 'app-subject',
    imports: [MatTableModule, MatButtonModule],
    templateUrl: './subject.component.html',
    styleUrl: './subject.component.scss',
})
export class SubjectComponent implements OnInit {
    readonly dialog = inject(MatDialog);
    readonly displayedColumns: string[] = [
        'name',
        'code',
        'signupType',
        'requirementType',
        'interiorOrganization',
        'recommendedTerm',
        'credit',
    ];

    subjects: Subject[] = [];

    constructor(private subjectService: SubjectService) {}

    ngOnInit(): void {
        this.loadSubjects();
    }

    loadSubjects(): void {
        this.subjectService.getAllSubjects().subscribe({
            next: (subjects) => {
                this.subjects = subjects;
            },
            error: () => {
                console.log('Error while loading organisations.');
            },
        });
    }

    openCreateSubjectDialog(): void {
        const dialogRef = this.dialog.open(SubjectDialogComponent);

        dialogRef
            .afterClosed()
            .subscribe((result: Omit<Subject, 'uuid'> | undefined) => {
                if (result !== undefined) {
                    this.subjectService.addSubject(result);
                }
            });
    }

    openEditSubjectDialog(row: Subject): void {
        const dialogRef = this.dialog.open(SubjectDialogComponent, {
            data: row,
        });

        dialogRef.afterClosed().subscribe((result: Subject | undefined) => {
            if (result !== undefined) {
                this.subjectService.editSubject(result);
            }
        });
    }
}
