import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-main-tabs',
  template: `
    <ion-content [fullscreen]="true">
      <ion-router-outlet></ion-router-outlet>
    </ion-content>
    
    <!-- Bottom Navigation -->
    <div class="bottom-navigation">
      <div
        class="nav-item"
        [class.active]="getActiveTab() === 'home'"
        (click)="navigateTo('/home')"
      >
        <ion-icon name="home"></ion-icon>
        <span>Home</span>
      </div>
      <div
        class="nav-item"
        [class.active]="getActiveTab() === 'explore'"
        (click)="navigateTo('/explore')"
      >
        <ion-icon name="compass-outline"></ion-icon>
        <span>Explore</span>
      </div>
      <div
        class="nav-item"
        [class.active]="getActiveTab() === 'favorites'"
        (click)="navigateTo('/favorites')"
      >
        <ion-icon name="heart-outline"></ion-icon>
        <span>Favorites</span>
      </div>
      <div
        class="nav-item"
        [class.active]="getActiveTab() === 'account'"
        (click)="navigateTo('/account')" 
      >
        <ion-icon name="person-outline"></ion-icon>
        <span>Account</span>
      </div>
    </div>
  `,
  styles: [`
    .bottom-navigation {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: white;
      padding: 12px 0 calc(16px + env(safe-area-inset-bottom));
      box-shadow: 0 -6px 30px rgba(0, 0, 0, 0.1);
      border-radius: 30px 30px 0 0;
      display: flex;
      justify-content: space-around;
      align-items: center;
      z-index: 1000;
      height: auto;
      min-height: 75px;
      margin: 0 16px;
    }

    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      cursor: pointer;
      transition: all 0.25s ease;
      color: #6b7280; /* iOS-like grey */
      padding: 8px 0;
      flex: 1;
      position: relative;
      min-height: 50px;
    }

    .nav-item ion-icon {
      font-size: 22px;
      transition: all 0.25s ease;
    }

    .nav-item span {
      font-size: 10px;
      font-weight: 400;
      transition: all 0.25s ease;
    }

    .nav-item.active {
      color: #000000; /* Black for active state */
    }

    .nav-item.active ion-icon {
      color: #000000; /* Black for active state */
      transform: scale(1.05);
    }

    .nav-item:hover:not(.active) {
      color: #374151;
    }
  `],
  standalone: true,
  imports: [IonicModule]
})
export class MainTabsComponent {
  constructor(private router: Router) {}

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  getActiveTab(): string {
    const url = this.router.url;
    if (url.includes('/home')) return 'home';
    if (url.includes('/explore')) return 'explore';
    if (url.includes('/favorites')) return 'favorites';
    if (url.includes('/account')) return 'account';
    return 'home';
  }
}