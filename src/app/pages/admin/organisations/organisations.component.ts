import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Organisation } from '../../../shared/models/organisation';
import { OrganisationService } from '../../../shared/services/organisation.service';
import { OrganisationDialogComponent } from './organisation-dialog/organisation-dialog.component';

@Component({
  selector: 'app-organisations',
  imports: [MatTableModule, MatButtonModule, MatIcon, RouterLink],
  templateUrl: './organisations.component.html',
  styleUrl: './organisations.component.scss',
})
export class OrganisationsComponent {
  private readonly dialog = inject(MatDialog);

  public readonly displayedColumns: string[] = ['code', 'city', 'name', 'omCode', 'postCode', 'street', 'actions'];
  public readonly organisations: Signal<Organisation[]>;

  constructor(private readonly organisationService: OrganisationService) {
    this.organisations = toSignal(this.organisationService.organisations$, { initialValue: [] });
  }

  public openCreateOrganisationDialog(): void {
    const dialogRef = this.dialog.open(OrganisationDialogComponent);

    dialogRef.afterClosed().subscribe((result: Organisation | undefined) => {
      if (result) {
        this.organisationService.create(result);
      }
    });
  }

  public openEditOrganisationDialog(data: Organisation): void {
    const dialogRef = this.dialog.open(OrganisationDialogComponent, { data });

    dialogRef.afterClosed().subscribe((result: Organisation | undefined) => {
      if (result) {
        this.organisationService.update(result);
      }
    });
  }

  public delete(row: Organisation): void {
    this.organisationService.delete(row.id);
  }
}
