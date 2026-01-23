import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'intro',
    pathMatch: 'full',
  },
  {
    path: 'intro',
    loadComponent: () => import('./intro/intro.page').then((m) => m.IntroPage),
  },
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'explore',
        loadComponent: () => import('./explore/explore.page').then((m) => m.ExplorePage),
      },
      {
        path: 'favorites',
        loadComponent: () => import('./favorites/favorites.page').then((m) => m.FavoritesPage),
      },
      {
        path: 'account',
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      }
    ]
  },
  {
    path: 'home',
    redirectTo: 'tabs/home',
    pathMatch: 'full'
  },
  {
    path: 'explore',
    redirectTo: 'tabs/explore',
    pathMatch: 'full'
  },
  {
    path: 'favorites',
    redirectTo: 'tabs/favorites',
    pathMatch: 'full'
  },
  {
    path: 'car/:id',
    loadComponent: () => import('./car-detail/car-detail.page').then((m) => m.CarDetailPage),
  },
  {
    path: '**',
    redirectTo: 'tabs/home',
    pathMatch: 'full'
  }
];
