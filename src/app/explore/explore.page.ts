import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonImg,
  IonButtons
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  heartOutline,
  heart,
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
  filterOutline
} from 'ionicons/icons';
import { FavoriteService, Car } from '../services/favorite.service';
import { CAR_DATABASE } from '../services/car-data';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSearchbar,
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon,
    IonImg,
    IonButtons
  ]
})
export class ExplorePage {
  allCars: Car[] = [];
  cars: Car[] = [];
  searchQuery: string = '';
  activeTab: string = 'explore';

  private router = inject(Router);
  private favoriteService = inject(FavoriteService);

  constructor() {
    // Register icons
    addIcons({
      'heart-outline': heartOutline,
      'heart': heart,
      'share-social-outline': shareSocialOutline,
      'navigate-outline': navigateOutline,
      'star': star,
      'star-outline': starOutline,
      'search-outline': searchOutline,
      'home': home,
      'compass-outline': compassOutline,
      'cart-outline': cartOutline,
      'person-outline': personOutline,
      'menu-outline': menuOutline,
      'notifications-outline': notificationsOutline,
      'filter-outline': filterOutline
    });

    // Initialize with sample data
    this.allCars = [...CAR_DATABASE];
    this.rebuildCarList();

  }

  toggleFavorite(car: Car, event: Event) {
    event.stopPropagation();
    this.favoriteService.toggleFavorite(car);
    this.rebuildCarList();

    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }

  onSearch(event: any) {
    this.searchQuery = event.target.value;
    this.filterCars();
  }

  filterCars() {
    if (this.searchQuery.trim() === '') {
      this.cars = [...this.allCars];
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.cars = this.allCars.filter(car =>
      car.name.toLowerCase().includes(query) ||
      car.brand.toLowerCase().includes(query) ||
      car.model.toLowerCase().includes(query)
    );
  }

  private rebuildCarList() {
    this.favoriteService.syncFavorites(this.allCars);
    this.filterCars();
  }

  onCarClick(car: Car) {
    this.router.navigate(['/car', car.id], { state: { car: car } });
  }

  onTabChange(tabName: string) {
    this.activeTab = tabName;
    console.log('Active tab changed to:', tabName);

    switch(tabName) {
      case 'home':
        this.router.navigate(['/home']);
        break;
      case 'explore':
        // Already on explore page
        break;
      case 'favorites':
        this.router.navigate(['/favorites']);
        break;
      case 'account':
        // For now, stay on explore - you'll update this later
        break;
      default:
        this.router.navigate(['/home']);
        break;
    }
  }

  openMenu() {
    console.log('Menu button clicked');
    alert('Menu functionality would open here');
  }

  showNotifications() {
    console.log('Notifications button clicked');
    alert('Notifications would show here');
  }

  getStars(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < rating);
  }
}
