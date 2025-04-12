import { Component, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { OrganisationDialogComponent } from './organisation-dialog/organisation-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { Organisation } from '../../shared/models/organisation';

const ORGANISATION_DATA: Organisation[] = [
    {
        uuid: '927e2278-7fa7-4bc8-ad5d-5809f2fb6105',
        code: 'SZTE',
        city: 'Szeged',
        name: 'Szegedi Tudományegyetem',
        omCode: 'FI62198',
        postCode: '6720',
        street: 'Dugonics tér 13.',
        image: '',
    },
];

@Component({
    selector: 'app-organisation',
    imports: [MatTableModule, MatButtonModule],
    templateUrl: './organisation.component.html',
    styleUrl: './organisation.component.scss',
})
export class OrganisationComponent {
    displayedColumns: string[] = [
        'code',
        'city',
        'name',
        'omCode',
        'postCode',
        'street',
    ];

    dataSource = new MatTableDataSource<Organisation>(ORGANISATION_DATA);

    readonly dialog = inject(MatDialog);
    create(): void {
        const dialogRef = this.dialog.open(OrganisationDialogComponent);

        dialogRef.afterClosed().subscribe((result) => {
            if (result !== undefined) {
                this.dataSource.data = [...this.dataSource.data, result];
            }
        });
    }
    edit(row: Organisation): void {
        const dialogRef = this.dialog.open(OrganisationDialogComponent, {
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
