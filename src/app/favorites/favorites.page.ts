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
  IonInput,
  IonIcon,
  IonImg,
  IonButtons,
  IonList,
  IonItem,
  IonNote,
  IonMenuButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  heart,
  heartOutline,
  shareSocialOutline,
  navigateOutline,
  star,
  starOutline,
  searchOutline,
  home,
  compassOutline,
  cartOutline,
  personOutline,
  menuOutline,
  notificationsOutline,
  diamondOutline,
  flashOutline,
  carSportOutline
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
    IonInput,
    IonIcon,
    IonImg,
    IonButtons,
    IonList,
    IonItem,
    IonNote,
    IonMenuButton
  ]
})
export class FavoritesPage {
  favoriteCars: Car[] = [];
  searchQuery = '';
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
      'search-outline': searchOutline,
      'share-social-outline': shareSocialOutline,
      'navigate-outline': navigateOutline,
      star,
      'star-outline': starOutline,
      home,
      'compass-outline': compassOutline,
      'cart-outline': cartOutline,
      'person-outline': personOutline,
      'menu-outline': menuOutline,
      'notifications-outline': notificationsOutline,
      'diamond-outline': diamondOutline,
      'flash-outline': flashOutline,
      'car-sport-outline': carSportOutline
    });

    this.loadFavorites();
  }

  ionViewWillEnter(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.favoriteCars = this.favoriteService.getFavorites();
    console.log('Loaded favorites:', this.favoriteCars.length);
  }

  onSearch(event: any): void {
    this.searchQuery = event?.detail?.value ?? '';
  }

  toggleFavorite(car: Car, event: Event): void {
    event.stopPropagation();
    this.favoriteService.toggleFavorite(car);
    
    // Update the local list
    this.loadFavorites();

    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }

  onCarClick(car: Car): void {
    this.router.navigate(['/car', car.id], { state: { car } });
  }

  openCarDetails(car: Car, event: Event): void {
    event.stopPropagation();
    this.onCarClick(car);
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

  get filteredFavoriteCars(): Car[] {
    const query = this.searchQuery.trim().toLowerCase();

    if (!query) {
      return this.favoriteCars;
    }

    return this.favoriteCars.filter(
      (car) =>
        car.name.toLowerCase().includes(query) ||
        car.brand.toLowerCase().includes(query) ||
        car.model.toLowerCase().includes(query)
    );
  }
}
