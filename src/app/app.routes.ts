import { Routes } from '@angular/router';
import { adminGuard, authGuard, publicGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'organisation',
    loadComponent: () => import('./pages/organisation/organisation.component').then(m => m.OrganisationComponent),
    canActivate: [adminGuard],
  },
  {
    path: 'curriculum',
    loadComponent: () => import('./pages/curriculum/curriculum.component').then(m => m.CurriculumComponent),
    canActivate: [adminGuard],
  },
  {
    path: 'subject',
    loadComponent: () => import('./pages/subject/subject.component').then(m => m.SubjectComponent),
    canActivate: [adminGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    canActivate: [publicGuard],
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent),
    canActivate: [publicGuard],
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard],
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
