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
  personOutline
} from 'ionicons/icons';
import { FavoriteService, Car } from '../services/favorite.service';

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
      'person-outline': personOutline
    });

    // Initialize with sample data
    this.allCars = [
      {
        id: 1,
        name: 'BMW M5 Competition',
        brand: 'BMW',
        model: 'M5 Competition',
        year: 2023,
        price: 115900,
        mileage: 15000,
        fuelType: 'Gasoline',
        transmission: 'Automatic',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        isFavorite: false,
        features: ['Leather Seats', 'Sunroof', 'Navigation', 'Premium Sound']
      },
      {
        id: 2,
        name: 'BMW X6 M Competition',
        brand: 'BMW',
        model: 'X6 M Competition',
        year: 2023,
        price: 108900,
        mileage: 12000,
        fuelType: 'Gasoline',
        transmission: 'Automatic',
        rating: 4,
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        isFavorite: false,
        features: ['360 Camera', 'Heated Seats', 'Panoramic Sunroof', 'Air Suspension']
      },
      {
        id: 3,
        name: 'Mercedes-Benz GLE 450',
        brand: 'Mercedes-Benz',
        model: 'GLE 450',
        year: 2023,
        price: 63500,
        mileage: 12000,
        fuelType: 'Hybrid',
        transmission: 'Automatic',
        rating: 4,
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        isFavorite: false,
        features: ['360 Camera', 'Heated Seats', 'Panoramic Sunroof', 'Air Suspension']
      },
      {
        id: 4,
        name: 'Mercedes-Benz S-Class',
        brand: 'Mercedes-Benz',
        model: 'S 580',
        year: 2023,
        price: 116500,
        mileage: 8000,
        fuelType: 'Hybrid',
        transmission: 'Automatic',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        isFavorite: false,
        features: ['Massaging Seats', 'Air Purification', 'Burmester Sound', 'Magic Sky Control']
      },
      {
        id: 5,
        name: 'Audi RS7 Sportback',
        brand: 'Audi',
        model: 'RS7 Sportback',
        year: 2023,
        price: 119900,
        mileage: 8500,
        fuelType: 'Gasoline',
        transmission: 'Automatic',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        isFavorite: false,
        features: ['Quattro AWD', 'Virtual Cockpit', 'Matrix LED Headlights', 'Bang & Olufsen Sound']
      },
      {
        id: 6,
        name: 'Audi Q8',
        brand: 'Audi',
        model: 'Q8',
        year: 2023,
        price: 84700,
        mileage: 10000,
        fuelType: 'Gasoline',
        transmission: 'Automatic',
        rating: 4,
        image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        isFavorite: false,
        features: ['Virtual Cockpit Plus', 'Matrix LED Headlights', 'Panoramic Sunroof', 'Valcona Leather']
      }
    ];

    this.cars = [...this.allCars];
  }

  toggleFavorite(car: Car, event: Event) {
    event.stopPropagation();
    this.favoriteService.toggleFavorite(car);

    // Add haptic feedback on favorite
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
    } else {
      this.cars = this.allCars.filter(car =>
        car.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        car.brand.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        car.model.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
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

  getStars(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < rating);
  }
}
