import { Injectable, inject } from '@angular/core';
import { Observable, of, catchError, map, throwError } from 'rxjs';
import { FirestoreService } from './firestore.service';
import type { Car } from './favorite.service';

@Injectable({
  providedIn: 'root'
})
export class CarApiService {
  private readonly firestoreService = inject(FirestoreService);
  private readonly cacheKey = 'autoelite_cars_cache_v1';
  private readonly cacheTimestampKey = 'autoelite_cars_cache_ts_v1';
  private readonly cacheTtlMs = 1000 * 60 * 10;

  getCars(filters?: {
    search?: string;
    brand?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Observable<Car[]> {
    return new Observable<Car[]>((observer) => {
      this.firestoreService
        .getCars()
        .then((cars) => {
          this.saveCache(cars);
          let filteredCars = cars;

          if (filters?.search) {
            const search = filters.search.toLowerCase();
            filteredCars = filteredCars.filter(
              (car) =>
                car.name.toLowerCase().includes(search) ||
                car.brand.toLowerCase().includes(search) ||
                car.model.toLowerCase().includes(search)
            );
          }

          if (filters?.brand) {
            filteredCars = filteredCars.filter((car) => car.brand === filters.brand);
          }

          if (filters?.type) {
            filteredCars = filteredCars.filter((car) => car.type === filters.type);
          }

          if (typeof filters?.minPrice === 'number') {
            filteredCars = filteredCars.filter((car) => car.price >= filters.minPrice!);
          }

          if (typeof filters?.maxPrice === 'number') {
            filteredCars = filteredCars.filter((car) => car.price <= filters.maxPrice!);
          }

          observer.next(filteredCars.map((car) => this.normalizeCar(car)));
          observer.complete();
        })
        .catch((error) => {
          const cachedCars = this.getCachedCars();
          if (cachedCars.length) {
            observer.next(cachedCars.map((car) => this.normalizeCar(car)));
            observer.complete();
            return;
          }
          observer.error(error);
        });
    });
  }

  getCarById(id: string): Observable<Car> {
    return new Observable<Car>((observer) => {
      this.firestoreService
        .getCarById(id)
        .then((car) => {
          if (!car) {
            const cached = this.getCachedCars().find((item) => item.id === id);
            if (cached) {
              observer.next(this.normalizeCar(cached));
              observer.complete();
              return;
            }
            observer.error(new Error('Car not found'));
            return;
          }
          observer.next(this.normalizeCar(car));
          observer.complete();
        })
        .catch((error) => {
          const cached = this.getCachedCars().find((item) => item.id === id);
          if (cached) {
            observer.next(this.normalizeCar(cached));
            observer.complete();
            return;
          }
          observer.error(error);
        });
    });
  }

  // Admin methods for managing cars
  addCar(car: Omit<Car, 'id'>): Observable<string> {
    return new Observable<string>((observer) => {
      this.firestoreService
        .addCar(car)
        .then((id) => {
          observer.next(id);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  updateCar(id: string, car: Partial<Car>): Observable<void> {
    return new Observable<void>((observer) => {
      this.firestoreService
        .updateCar(id, car)
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  deleteCar(id: string): Observable<void> {
    return new Observable<void>((observer) => {
      this.firestoreService
        .deleteCar(id)
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  private normalizeCar(raw: Partial<Car>): Car {
    const rating =
      typeof raw.rating === 'number' && Number.isFinite(raw.rating)
        ? Math.max(1, Math.min(5, Math.round(raw.rating)))
        : 4;

    const features = Array.isArray(raw.features)
      ? raw.features.filter((feature): feature is string => typeof feature === 'string')
      : [];

    return {
      id: raw.id || '',
      name: raw.name?.trim() || `${raw.brand ?? 'Unknown'} ${raw.model ?? ''}`.trim(),
      brand: raw.brand?.trim() || 'Unknown',
      model: raw.model?.trim() || 'Model',
      year: Number(raw.year ?? new Date().getFullYear()),
      price: Number(raw.price ?? 0),
      mileage: Number(raw.mileage ?? 0),
      fuelType: raw.fuelType?.trim() || 'Gasoline',
      transmission: raw.transmission?.trim() || 'Automatic',
      rating,
      image:
        raw.image?.trim() ||
        'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1000&q=80',
      gallery: raw.gallery || [],
      isFavorite: Boolean(raw.isFavorite),
      features,
      type: raw.type?.trim() || 'Sedan',
      // Additional details
      exteriorColor: raw.exteriorColor?.trim() || '',
      interiorColor: raw.interiorColor?.trim() || '',
      engine: raw.engine?.trim() || '',
      drivetrain: raw.drivetrain?.trim() || '',
      horsepower: Number(raw.horsepower ?? 0),
      seats: Number(raw.seats ?? 5),
      vin: raw.vin?.trim() || '',
      stockNumber: raw.stockNumber?.trim() || '',
      condition: raw.condition?.trim() || 'Used',
      bodyStyle: raw.bodyStyle?.trim() || '',
      doors: Number(raw.doors ?? 4),
      mpgCity: raw.mpgCity || 0,
      mpgHighway: raw.mpgHighway || 0,
      mpgCombined: raw.mpgCombined || 0
    };
  }

  private saveCache(cars: Car[]) {
    try {
      localStorage.setItem(this.cacheKey, JSON.stringify(cars));
      localStorage.setItem(this.cacheTimestampKey, Date.now().toString());
    } catch {
      // Ignore caching errors
    }
  }

  private getCachedCars(): Car[] {
    try {
      const ts = Number(localStorage.getItem(this.cacheTimestampKey));
      if (ts && Date.now() - ts > this.cacheTtlMs) {
        return [];
      }
      const raw = localStorage.getItem(this.cacheKey);
      return raw ? (JSON.parse(raw) as Car[]) : [];
    } catch {
      return [];
    }
  }
}
