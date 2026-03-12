import { Injectable, inject } from '@angular/core';
import { FirestoreService } from './firestore.service';

export interface Car {
  id: string | number;
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
  gallery?: string[];  // Optional gallery images (up to 4)
  isFavorite: boolean;
  features: string[];
  type: string;
  // Additional details for car detail page
  exteriorColor?: string;
  interiorColor?: string;
  engine?: string;
  drivetrain?: string;
  mpgCity?: number;
  mpgHighway?: number;
  mpgCombined?: number;
  horsepower?: number;
  seats?: number;
  vin?: string;
  stockNumber?: string;
  condition?: string;
  bodyStyle?: string;
  doors?: number;
}

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private favorites: Car[] = [];
  private readonly firestoreService = inject(FirestoreService);

  constructor() {
    // Load favorites from localStorage on initialization
    this.loadFavorites();
    this.firestoreService.onAuthStateChanged((user) => {
      void this.syncWithUserProfile(user?.uid ?? null);
    });
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
    void this.persistFavorites();
  }

  // Check if a car is favorited
  isFavorite(carId: string | number): boolean {
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
  removeFromFavorites(carId: string | number): void {
    const index = this.favorites.findIndex(fav => fav.id === carId);
    if (index > -1) {
      this.favorites.splice(index, 1);
      this.saveFavorites();
      void this.persistFavorites();
    }
  }

  // Clear all favorites
  clearFavorites(): void {
    this.favorites = [];
    this.saveFavorites();
    void this.persistFavorites();
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

  private async persistFavorites(): Promise<void> {
    const user = this.firestoreService.getCurrentUser();
    if (!user?.uid) {
      return;
    }

    await this.firestoreService.saveFavoriteIds(
      user.uid,
      this.favorites.map((fav) => fav.id)
    );
  }

  private async syncWithUserProfile(userId: string | null): Promise<void> {
    if (!userId) {
      this.loadFavorites();
      return;
    }

    const profile = await this.firestoreService.getUserProfile(userId);
    const favoriteIds = Array.isArray(profile?.favoriteCarIds)
      ? profile.favoriteCarIds.map((id: unknown) => String(id))
      : [];

    if (!favoriteIds.length) {
      await this.persistFavorites();
      return;
    }

    const currentFavoriteIds = new Set(this.favorites.map((fav) => String(fav.id)));
    if (favoriteIds.every((id: string) => currentFavoriteIds.has(id))) {
      return;
    }

    const cachedMap = new Map(this.favorites.map((fav) => [String(fav.id), fav]));
    const restoredFavorites: Car[] = [];
    favoriteIds.forEach((id: string) => {
      const cachedCar = cachedMap.get(id);
      if (cachedCar) {
        restoredFavorites.push(cachedCar);
      }
    });
    this.favorites = restoredFavorites;
    this.saveFavorites();
  }
}
