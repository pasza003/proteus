import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'organisation',
    loadComponent: () => import('./pages/organisation/organisation.component').then(m => m.OrganisationComponent),
  },
  {
    path: 'curriculum',
    loadComponent: () => import('./pages/curriculum/curriculum.component').then(m => m.CurriculumComponent),
  },
  {
    path: 'subject',
    loadComponent: () => import('./pages/subject/subject.component').then(m => m.SubjectComponent),
  },
];
