import { Routes } from '@angular/router';
import { selectedCurriculumResolver } from './pages/admin/curriculum/resolvers/selected-curriculum.resolver';
import { selectedOrganisationResolver } from './pages/admin/organisation/resolvers/selected-organisation.resolver';
import { adminGuard, authGuard, publicGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'admin/organisations',
    loadComponent: () => import('./pages/admin/organisations/organisations.component').then(m => m.OrganisationsComponent),
    canActivate: [adminGuard],
  },
  {
    path: 'admin/organisations/:organisationId',
    loadComponent: () => import('./pages/admin/organisation/organisation.component').then(m => m.OrganisationComponent),
    canActivate: [adminGuard],
    resolve: {
      data: selectedOrganisationResolver,
    },
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'admin/curriculums',
    loadComponent: () => import('./pages/admin/curriculums/curriculums.component').then(m => m.CurriculumsComponent),
    canActivate: [adminGuard],
  },
  {
    path: 'admin/curriculums/:curriculumId',
    loadComponent: () => import('./pages/admin/curriculum/curriculum.component').then(m => m.CurriculumComponent),
    canActivate: [adminGuard],
    resolve: {
      data: selectedCurriculumResolver,
    },
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'admin/subjects',
    loadComponent: () => import('./pages/admin/subjects/subjects.component').then(m => m.SubjectsComponent),
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
