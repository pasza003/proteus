import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { Curriculum } from '../../shared/models/curriculum';
import { CurriculumService } from '../../shared/services/curriculum.service';
import { CurriculumDialogComponent } from './curriculum-dialog/curriculum-dialog.component';

@Component({
    selector: 'app-curriculum',
    imports: [MatTableModule, MatButtonModule],
    templateUrl: './curriculum.component.html',
    styleUrl: './curriculum.component.scss',
})
export class CurriculumComponent {
    readonly dialog = inject(MatDialog);
    readonly displayedColumns: string[] = [
        'code',
        'name',
        'terms',
        'requiredCredit',
    ];

    curriculums: Curriculum[] = [];

    constructor(private curriculumService: CurriculumService) {}

    ngOnInit(): void {
        this.loadCurriculums();
    }

    loadCurriculums(): void {
        this.curriculumService.getAllCurriculums().subscribe({
            next: (curriculums) => {
                this.curriculums = curriculums;
            },
            error: () => {
                console.log('Error while loading curriculums.');
            },
        });
    }

    openCreateCurriculumDialog(): void {
        const dialogRef = this.dialog.open(CurriculumDialogComponent);

        dialogRef
            .afterClosed()
            .subscribe((result: Omit<Curriculum, 'uuid'> | undefined) => {
                if (result !== undefined) {
                    this.curriculumService.addCurriculum(result);
                }
            });
    }

    openEditCurriculumDialog(row: Curriculum): void {
        const dialogRef = this.dialog.open(CurriculumDialogComponent, {
            data: row,
        });

        dialogRef.afterClosed().subscribe((result: Curriculum | undefined) => {
            if (result !== undefined) {
                this.curriculumService.editCurriculum(result);
            }
        });
    }
}
