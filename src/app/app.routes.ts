import { Routes } from '@angular/router';
import { TabsPage } from './tabs/tabs.page';
import { adminGuard } from './guards/admin.guard';

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
    path: 'auth',
    loadComponent: () => import('./auth/auth.page').then((m) => m.AuthPage),
  },
  {
    path: 'admin-login',
    loadComponent: () => import('./admin/pages/admin-login/admin-login.page').then((m) => m.AdminLoginPage),
  },
  {
    path: 'admin',
    canMatch: [adminGuard],
    loadComponent: () => import('./admin/layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./admin/pages/admin-dashboard/admin-dashboard.page').then((m) => m.AdminDashboardPage),
      },
      {
        path: 'add-car',
        loadComponent: () => import('./admin/pages/admin-add-car/admin-add-car.page').then((m) => m.AdminAddCarPage),
      },
      {
        path: 'brands',
        loadComponent: () => import('./admin/pages/admin-brands/admin-brands.page').then((m) => m.AdminBrandsPage),
      },
      {
        path: 'categories',
        loadComponent: () => import('./admin/pages/admin-categories/admin-categories.page').then((m) => m.AdminCategoriesPage),
      },
      {
        path: 'cars',
        loadComponent: () => import('./admin/pages/admin-cars/admin-cars.page').then((m) => m.AdminCarsPage),
      },
      {
        path: 'orders',
        loadComponent: () => import('./admin/pages/admin-orders.page').then((m) => m.AdminOrdersPage),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'compare-cars',
    loadComponent: () => import('./compare-cars/compare-cars.page').then((m) => m.CompareCarsPage),
  },
  {
    path: 'recently-viewed',
    loadComponent: () => import('./recently-viewed/recently-viewed.page').then((m) => m.RecentlyViewedPage),
  },
  {
    path: 'trade-in',
    loadComponent: () => import('./trade-in/trade-in.page').then((m) => m.TradeInEstimatorPage),
  },
  {
    path: 'payment/:id',
    loadComponent: () => import('./payment/payment.page').then((m) => m.PaymentPage),
  },
  {
    path: 'settings',
    loadComponent: () => import('./account/settings.page').then((m) => m.SettingsPage),
  },
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
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
        loadComponent: () => import('./account/account.page').then((m) => m.AccountPage),
      },
    ],
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
