import { Injectable } from '@angular/core';
import { Organisation } from '../models/organisation';
import { BehaviorSubject, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
    providedIn: 'root',
})
export class OrganisationService {
    constructor() {}

    private organisations: Organisation[] = [
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

    private organisationsSubject = new BehaviorSubject<Organisation[]>(
        this.organisations
    );

    getAllOrganisations(): Observable<Organisation[]> {
        return this.organisationsSubject.asObservable();
    }

    addOrganisation(
        organisation: Omit<Organisation, 'uuid'>
    ): Promise<Organisation> {
        const newOrganisation: Organisation = {
            ...organisation,
            uuid: uuidv4(),
        };

        this.organisations.push(newOrganisation);

        this.organisationsSubject.next([...this.organisations]);
        return new Promise((resolve) => resolve(newOrganisation));
    }

    editOrganisation(organisation: Organisation): void {
        this.organisations = this.organisations.map((o) =>
            o.uuid === organisation.uuid ? organisation : o
        );

        this.organisationsSubject.next([
            ...this.organisations,
        ]);
    }
}
