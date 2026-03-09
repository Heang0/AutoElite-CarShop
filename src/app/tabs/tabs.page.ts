import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { home, compassOutline, heartOutline, personOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  template: `
    <div class="tabs-shell">
      <ion-router-outlet></ion-router-outlet>
    </div>

    <nav class="tabs-nav" aria-label="Primary">
      <button
        type="button"
        class="tabs-nav__item"
        [class.is-active]="isActive('/tabs/home')"
        (click)="navigate('/tabs/home')"
      >
          <ion-icon name="home"></ion-icon>
          <span>Home</span>
      </button>

      <button
        type="button"
        class="tabs-nav__item"
        [class.is-active]="isActive('/tabs/explore')"
        (click)="navigate('/tabs/explore')"
      >
          <ion-icon name="compass-outline"></ion-icon>
          <span>Explore</span>
      </button>

      <button
        type="button"
        class="tabs-nav__item"
        [class.is-active]="isActive('/tabs/favorites')"
        (click)="navigate('/tabs/favorites')"
      >
          <ion-icon name="heart-outline"></ion-icon>
          <span>Favorites</span>
      </button>

      <button
        type="button"
        class="tabs-nav__item"
        [class.is-active]="isActive('/tabs/account')"
        (click)="navigate('/tabs/account')"
      >
          <ion-icon name="person-outline"></ion-icon>
          <span>Account</span>
      </button>
    </nav>
  `,
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule]
})
export class TabsPage {
  private readonly router = inject(Router);

  constructor() {
    addIcons({ home, compassOutline, heartOutline, personOutline });
  }

  navigate(path: string): void {
    if (this.router.url === path) {
      return;
    }

    void this.router.navigateByUrl(path);
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }
}
