import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, MenuController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  carSportOutline,
  compassOutline,
  heartOutline,
  home,
  logInOutline,
  logOutOutline,
  personOutline,
  swapHorizontalOutline,
  timeOutline
} from 'ionicons/icons';
import { FirestoreService } from '../services/firestore.service';

interface ShellMenuItem {
  icon: string;
  title: string;
  url: string;
}

@Component({
  selector: 'app-tabs',
  template: `
    <ion-menu contentId="tabs-content" menuId="main-menu" side="start" class="app-menu">
      <ion-content>
        <ion-list lines="none" class="app-menu__list">
          <ion-menu-toggle auto-hide="true" *ngFor="let item of menuItems">
            <ion-item button detail="false" (click)="navigate(item.url)" [class.is-active]="isActive(item.url)">
              <ion-icon slot="start" [name]="item.icon"></ion-icon>
              <ion-label>{{ item.title }}</ion-label>
            </ion-item>
          </ion-menu-toggle>
        </ion-list>

        <div class="app-menu__footer">
          <ion-button expand="block" fill="clear" *ngIf="!isLoggedIn" (click)="navigate('/auth')">
            <ion-icon slot="start" name="log-in-outline"></ion-icon>
            Sign In
          </ion-button>

          <ion-button expand="block" color="danger" *ngIf="isLoggedIn" (click)="signOut()">
            <ion-icon slot="start" name="log-out-outline"></ion-icon>
            Sign Out
          </ion-button>
        </div>
      </ion-content>
    </ion-menu>

    <div class="tabs-shell" id="tabs-content">
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
  imports: [CommonModule, IonicModule, RouterModule]
})
export class TabsPage implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly firestoreService = inject(FirestoreService);
  private readonly menuController = inject(MenuController);
  private authSubscription?: () => void;

  readonly menuItems: ShellMenuItem[] = [
    { title: 'Home', icon: 'home', url: '/tabs/home' },
    { title: 'Explore', icon: 'compass-outline', url: '/tabs/explore' },
    { title: 'Favorites', icon: 'heart-outline', url: '/tabs/favorites' },
    { title: 'Account', icon: 'person-outline', url: '/tabs/account' },
    { title: 'Recently Viewed', icon: 'time-outline', url: '/recently-viewed' },
    { title: 'Compare Cars', icon: 'swap-horizontal-outline', url: '/compare-cars' }
  ];
  isLoggedIn = false;

  constructor() {
    addIcons({
      'car-sport-outline': carSportOutline,
      'compass-outline': compassOutline,
      'heart-outline': heartOutline,
      home,
      'log-in-outline': logInOutline,
      'log-out-outline': logOutOutline,
      'person-outline': personOutline,
      'swap-horizontal-outline': swapHorizontalOutline,
      'time-outline': timeOutline
    });
  }

  ngOnInit(): void {
    this.authSubscription = this.firestoreService.onAuthStateChanged((user) => {
      this.isLoggedIn = !!user;
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.();
  }

  navigate(path: string): void {
    const isSamePath = this.router.url === path;
    void this.menuController.close('main-menu');

    if (isSamePath) {
      return;
    }

    void this.router.navigateByUrl(path);
  }

  async signOut(): Promise<void> {
    await this.firestoreService.signOut();
    this.isLoggedIn = false;
    this.navigate('/auth');
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }
}
