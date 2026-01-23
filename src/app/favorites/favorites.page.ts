import { Component, OnInit } from '@angular/core';
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
  IonButtons
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  heart,
  shareSocialOutline,
  navigateOutline,
  star,
  starOutline,
  home,
  compassOutline,
  cartOutline,
  personOutline
} from 'ionicons/icons';
import { FavoriteService, Car } from '../services/favorite.service';

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
    IonButtons
  ]
})
export class FavoritesPage implements OnInit {
  allCars: Car[] = [];
  favoriteCars: Car[] = [];
  activeTab: string = 'favorites';

  constructor(private router: Router, private favoriteService: FavoriteService) {
    // Register icons
    addIcons({
      'heart': heart,
      'share-social-outline': shareSocialOutline,
      'navigate-outline': navigateOutline,
      'star': star,
      'star-outline': starOutline,
      'home': home,
      'compass-outline': compassOutline,
      'cart-outline': cartOutline,
      'person-outline': personOutline
    });

    // Load favorites from service
    this.loadFavorites();
  }

  loadFavorites() {
    // Get actual favorites from service
    this.favoriteCars = this.favoriteService.getFavorites();
  }

  ngOnInit() {}

  toggleFavorite(car: Car, event: Event) {
    event.stopPropagation();
    this.favoriteService.toggleFavorite(car);

    // Reload favorites to update the list
    this.loadFavorites();

    // Add haptic feedback on favorite
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
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
        this.router.navigate(['/explore']);
        break;
      case 'favorites':
        // Already on favorites page
        break;
      case 'account':
        // For now, stay on favorites - you'll update this later
        break;
      default:
        this.router.navigate(['/home']);
        break;
    }
  }

  getStars(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < rating);
  }
}