import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { Organisation } from '../../shared/models/organisation';
import { OrganisationService } from './../../shared/services/organisation.service';
import { OrganisationDialogComponent } from './organisation-dialog/organisation-dialog.component';

@Component({
    selector: 'app-organisation',
    imports: [MatTableModule, MatButtonModule],
    templateUrl: './organisation.component.html',
    styleUrl: './organisation.component.scss',
})
export class OrganisationComponent implements OnInit {
    readonly dialog = inject(MatDialog);
    readonly displayedColumns: string[] = [
        'code',
        'city',
        'name',
        'omCode',
        'postCode',
        'street',
    ];
    organisations: Organisation[] = [];

    constructor(private organisationService: OrganisationService) {}

    ngOnInit(): void {
        this.loadOrganisations();
    }

    loadOrganisations(): void {
        this.organisationService.getAllOrganisations().subscribe({
            next: (organisations) => {
                this.organisations = organisations;
            },
            error: () => {
                console.log('Error while loading organisations.');
            },
        });
    }

    openCreateOrganisationDialog(): void {
        const dialogRef = this.dialog.open(OrganisationDialogComponent);

        dialogRef
            .afterClosed()
            .subscribe((result: Omit<Organisation, 'uuid'> | undefined) => {
                if (result !== undefined) {
                    this.organisationService.addOrganisation(result);
                }
            });
    }

    openEditOrganisationDialog(row: Organisation): void {
        const dialogRef = this.dialog.open(OrganisationDialogComponent, {
            data: row,
        });

        dialogRef
            .afterClosed()
            .subscribe((result: Organisation | undefined) => {
                if (result !== undefined) {
                    this.organisationService.editOrganisation(result);
                }
            });
    }
}
