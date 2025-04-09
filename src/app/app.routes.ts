import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'organisation',
        loadComponent: () => import('./pages/organisation/organisation.component').then(m => m.OrganisationComponent)
    },
];
