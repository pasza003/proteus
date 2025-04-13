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
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
];
