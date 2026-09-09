import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    data: { section: 'inicio' },
  },
  { path: 'movimientos', loadComponent: () => import('./home/home.page').then((m) => m.HomePage), data: { section: 'movimientos' } },
  { path: 'agregar', loadComponent: () => import('./home/home.page').then((m) => m.HomePage), data: { section: 'agregar' } },
  { path: 'reportes', loadComponent: () => import('./home/home.page').then((m) => m.HomePage), data: { section: 'reportes' } },
  { path: 'perfil', loadComponent: () => import('./home/home.page').then((m) => m.HomePage), data: { section: 'perfil' } },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
