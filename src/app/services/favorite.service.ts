import { Injectable } from '@angular/core';

export interface Car {
  id: number;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  rating: number;
  image: string;
  isFavorite: boolean;
  features: string[];
}

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private favorites: Car[] = [];

  constructor() {
    // Load favorites from localStorage on initialization
    this.loadFavorites();
  }

  // Toggle favorite status for a car
  toggleFavorite(car: Car): void {
    const index = this.favorites.findIndex(fav => fav.id === car.id);
    if (index > -1) {
      // Remove from favorites
      this.favorites.splice(index, 1);
      car.isFavorite = false;
    } else {
      // Add to favorites
      this.favorites.push({...car, isFavorite: true});
      car.isFavorite = true;
    }
    this.saveFavorites();
  }

  // Check if a car is favorited
  isFavorite(carId: number): boolean {
    return this.favorites.some(fav => fav.id === carId);
  }

  // Get all favorite cars
  getFavorites(): Car[] {
    return [...this.favorites];
  }

  // Save favorites to localStorage
  private saveFavorites(): void {
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

  // Load favorites from localStorage
  private loadFavorites(): void {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      this.favorites = JSON.parse(saved);
    }
  }

  // Remove a specific car from favorites
  removeFromFavorites(carId: number): void {
    const index = this.favorites.findIndex(fav => fav.id === carId);
    if (index > -1) {
      this.favorites.splice(index, 1);
      this.saveFavorites();
    }
  }

  // Clear all favorites
  clearFavorites(): void {
    this.favorites = [];
    this.saveFavorites();
  }

  /**
   * Synchronize the favorite flag on a batch of cars so UI reflects persisted state.
   */
  syncFavorites(cars: Car[]): void {
    const favoriteIds = new Set(this.favorites.map(fav => fav.id));
    cars.forEach(car => {
      car.isFavorite = favoriteIds.has(car.id);
    });
  }
}
