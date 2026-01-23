import { Component } from '@angular/core';
import {
  IonTabs,
  IonTab,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tabs',
  template: `
    <ion-tabs>
      <ion-tab tab="home" component="HomePage">
        <ion-router-outlet name="home"></ion-router-outlet>
      </ion-tab>
      <ion-tab tab="explore" component="ExplorePage">
        <ion-router-outlet name="explore"></ion-router-outlet>
      </ion-tab>
      <ion-tab tab="favorites" component="FavoritesPage">
        <ion-router-outlet name="favorites"></ion-router-outlet>
      </ion-tab>

      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/tabs/home">
          <ion-icon name="home"></ion-icon>
          <ion-label>Home</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="explore" href="/tabs/explore">
          <ion-icon name="compass-outline"></ion-icon>
          <ion-label>Explore</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="favorites" href="/tabs/favorites">
          <ion-icon name="heart-outline"></ion-icon>
          <ion-label>Favorites</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="account" href="/tabs/account">
          <ion-icon name="person-outline"></ion-icon>
          <ion-label>Account</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
  standalone: true,
  imports: [IonTabs, IonTab, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel]
})
export class TabsPage {}