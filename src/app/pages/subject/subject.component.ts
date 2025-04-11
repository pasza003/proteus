import { Component, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Subject } from '../../shared/models/subject';
import { SubjectDialogComponent } from './subject-dialog/subject-dialog.component';

const SUBJECT_DATA: Subject[] = [
    {
        uuid: 'ae45dc89-8086-4f5d-8e68-f82e3a295d0e',
        name: 'Webfejlesztési eszközök a gyakorlatban',
        code: 'IN1065SA',
        signupType: 'Kötelezően választható',
        requirementType: 'Gyakorlati jegy',
        interiorOrganization: 'TTIK Természettudományi és Informatikai Kar',
        recommendedTerm: 0,
        credit: 2,
        classesPerWeek: [
            {
                courseType: 'Gyakorlat',
                classesPerWeek: 2,
            },
        ],
    },
];

@Component({
    selector: 'app-subject',
    imports: [MatTableModule, MatButtonModule],
    templateUrl: './subject.component.html',
    styleUrl: './subject.component.scss',
})
export class SubjectComponent {
    displayedColumns: string[] = [
        'name',
        'code',
        'signupType',
        'requirementType',
        'interiorOrganization',
        'recommendedTerm',
        'credit',
    ];

    dataSource = new MatTableDataSource<Subject>(SUBJECT_DATA);

    readonly dialog = inject(MatDialog);
    create(): void {
        const dialogRef = this.dialog.open(SubjectDialogComponent);

        dialogRef.afterClosed().subscribe((result) => {
            if (result !== undefined) {
                this.dataSource.data = [...this.dataSource.data, result];
            }
        });
    }
    edit(row: Subject): void {
        const dialogRef = this.dialog.open(SubjectDialogComponent, {
            data: row,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result !== undefined) {
                this.dataSource.data = this.dataSource.data.map((org) =>
                    org.uuid === result.uuid ? result : org
                );
            }
        });
    }
}
