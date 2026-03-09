import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonImg,
  IonButtons,
  IonList,
  IonItem,
  IonNote
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  heart,
  heartOutline,
  shareSocialOutline,
  navigateOutline,
  star,
  starOutline,
  home,
  compassOutline,
  cartOutline,
  personOutline
} from 'ionicons/icons';
import { FavoriteService, type Car } from '../services/favorite.service';
import { type NotificationItem, NOTIFICATION_ITEMS } from '../data/notifications.data';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon,
    IonImg,
    IonButtons,
    IonList,
    IonItem,
    IonNote
  ]
})
export class FavoritesPage {
  favoriteCars: Car[] = [];
  activeTab = 'favorites';
  isNotificationsOpen = false;
  notificationItems: NotificationItem[] = NOTIFICATION_ITEMS;
  selectedNotification: NotificationItem | null = null;

  private router = inject(Router);
  private favoriteService = inject(FavoriteService);

  constructor() {
    addIcons({
      heart,
      'heart-outline': heartOutline,
      'share-social-outline': shareSocialOutline,
      'navigate-outline': navigateOutline,
      star,
      'star-outline': starOutline,
      home,
      'compass-outline': compassOutline,
      'cart-outline': cartOutline,
      'person-outline': personOutline
    });

    this.loadFavorites();
  }

  ionViewWillEnter(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.favoriteCars = this.favoriteService.getFavorites();
  }

  toggleFavorite(car: Car, event: Event): void {
    event.stopPropagation();
    this.favoriteService.toggleFavorite(car);
    this.loadFavorites();

    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }

  onCarClick(car: Car): void {
    this.router.navigate(['/car', car.id], { state: { car } });
  }

  openMenu(): void {
    console.log('Menu button clicked');
  }

  showNotifications(event?: Event): void {
    event?.stopPropagation();
    this.isNotificationsOpen = true;
    if (!this.selectedNotification && this.notificationItems.length) {
      this.selectedNotification = this.notificationItems[0];
    }
  }

  dismissNotifications(): void {
    this.isNotificationsOpen = false;
  }

  handleNotificationClick(notification: NotificationItem): void {
    this.selectedNotification = notification;
  }

  clearNotifications(): void {
    this.isNotificationsOpen = false;
    this.selectedNotification = null;
  }

  onTabChange(tabName: string): void {
    this.activeTab = tabName;

    switch (tabName) {
      case 'home':
        this.router.navigate(['/tabs/home']);
        break;
      case 'explore':
        this.router.navigate(['/tabs/explore']);
        break;
      case 'favorites':
        this.router.navigate(['/tabs/favorites']);
        break;
      case 'account':
        this.router.navigate(['/tabs/account']);
        break;
      default:
        this.router.navigate(['/tabs/home']);
        break;
    }
  }

  getStars(rating: number): boolean[] {
    return Array(5)
      .fill(false)
      .map((_, i) => i < rating);
  }
}
