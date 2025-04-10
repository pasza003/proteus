import { Component, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Curriculum } from '../../shared/models/curriculum';
import { CurriculumDialogComponent } from './curriculum-dialog/curriculum-dialog.component';

const CURRICULUM_DATA: Curriculum[] = [
    {
        uuid: "816d823e-609f-4ef8-b59a-57904cc0230b",
        code: "BSZKUFO-N1",
        name: "Üzemmérnök-informatikus BProf_N",
        terms: 6,
        requiredCredit: 180,
    }
];

@Component({
    selector: 'app-curriculum',
    imports: [MatTableModule, MatButtonModule],
    templateUrl: './curriculum.component.html',
    styleUrl: './curriculum.component.scss',
})
export class CurriculumComponent {
    displayedColumns: string[] = [
        'code',
        'name',
        'terms',
        'requiredCredit',
    ];

    dataSource = new MatTableDataSource<Curriculum>(CURRICULUM_DATA);

    readonly dialog = inject(MatDialog);
    create(): void {
        const dialogRef = this.dialog.open(CurriculumDialogComponent);

        dialogRef.afterClosed().subscribe((result) => {
            if (result !== undefined) {
                this.dataSource.data = [...this.dataSource.data, result];
            }
        });
    }
    edit(row: Curriculum): void {
        const dialogRef = this.dialog.open(CurriculumDialogComponent, {
            data: row,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result !== undefined) {
                this.dataSource.data = this.dataSource.data.map((curriculum) =>
                    curriculum.uuid === result.uuid ? result : curriculum
                );
            }
        });
    }
}
