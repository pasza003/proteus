import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Curriculum } from '../../../shared/models/curriculum';
import { CurriculumService } from '../../../shared/services/curriculum.service';
import { CurriculumDialogComponent } from './curriculum-dialog/curriculum-dialog.component';

@Component({
  selector: 'app-curriculums',
  imports: [MatTableModule, MatButtonModule, MatIcon, RouterLink],
  templateUrl: './curriculums.component.html',
  styleUrl: './curriculums.component.scss',
})
export class CurriculumsComponent {
  private readonly dialog = inject(MatDialog);

  public readonly displayedColumns: string[] = ['code', 'name', 'terms', 'requiredCredit', 'actions'];
  public readonly curriculums: Signal<Curriculum[]>;

  constructor(private readonly curriculumService: CurriculumService) {
    this.curriculums = toSignal(this.curriculumService.curriculums$, { initialValue: [] });
  }

  public openCreateCurriculumDialog(): void {
    const dialogRef = this.dialog.open(CurriculumDialogComponent);

    dialogRef.afterClosed().subscribe((result: Curriculum | undefined) => {
      if (result) {
        this.curriculumService.create(result);
      }
    });
  }

  public openEditCurriculumDialog(data: Curriculum): void {
    const dialogRef = this.dialog.open(CurriculumDialogComponent, { data });

    dialogRef.afterClosed().subscribe((result: Curriculum | undefined) => {
      if (result) {
        this.curriculumService.update(result);
      }
    });
  }

  public delete(row: Curriculum): void {
    this.curriculumService.delete(row.id);
  }
}
