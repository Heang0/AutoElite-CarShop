import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonContent, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, 
  IonImg, IonTitle
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, closeOutline, checkmarkOutline, carOutline } from 'ionicons/icons';
import { CarApiService } from '../services/car-api.service';
import type { Car } from '../services/favorite.service';

@Component({
  selector: 'app-compare-cars',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="goBack()">
            <ion-icon slot="icon-only" name="arrow-back-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Compare Cars</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="compare-page">
        <!-- Select Cars Section -->
        <div class="select-cars" *ngIf="carsToCompare.length < 2">
          <div class="empty-state">
            <ion-icon name="car-outline"></ion-icon>
            <h3>Select Cars to Compare</h3>
            <p>Choose up to 2 cars to compare side by side</p>
            <ion-button (click)="browseCars()">Browse Cars</ion-button>
          </div>
        </div>

        <!-- Comparison Table -->
        <div class="comparison-table" *ngIf="carsToCompare.length >= 2">
          <div class="compare-header">
            <div class="compare-placeholder"></div>
            <div class="compare-car" *ngFor="let car of carsToCompare; let i = index">
              <button class="remove-btn" (click)="removeCar(i)">
                <ion-icon name="close-outline"></ion-icon>
              </button>
              <ion-img [src]="car.image" [alt]="car.name"></ion-img>
              <h3>{{ car.year }} {{ car.brand }} {{ car.model }}</h3>
              <div class="price">\${{ car.price | number }}</div>
            </div>
          </div>

          <div class="compare-row" *ngFor="let spec of specs">
            <div class="spec-label">{{ spec.label }}</div>
            <div class="spec-value" *ngFor="let car of carsToCompare">
              {{ getValue(car, spec.key) }}
            </div>
          </div>

          <div class="compare-actions">
            <ion-button expand="block" (click)="clearComparison()">
              Clear Comparison
            </ion-button>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .compare-page {
      padding: 20px;
    }

    .select-cars {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
    }

    .empty-state {
      text-align: center;
      padding: 40px 20px;
    }

    .empty-state ion-icon {
      font-size: 80px;
      color: #bdc3c7;
      margin-bottom: 20px;
    }

    .empty-state h3 {
      margin: 0 0 8px 0;
      font-size: 22px;
      color: #2c3e50;
    }

    .empty-state p {
      margin: 0 0 24px 0;
      font-size: 15px;
      color: #7f8c8d;
    }

    .comparison-table {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .compare-header {
      display: grid;
      grid-template-columns: 120px 1fr 1fr;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
    }

    .compare-placeholder {
      padding: 20px;
    }

    .compare-car {
      padding: 20px;
      text-align: center;
      position: relative;
    }

    .remove-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      border: none;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .compare-car ion-img {
      width: 100%;
      height: 120px;
      object-fit: cover;
      border-radius: 8px;
      margin-bottom: 12px;
    }

    .compare-car h3 {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
    }

    .price {
      font-size: 20px;
      font-weight: 700;
    }

    .compare-row {
      display: grid;
      grid-template-columns: 120px 1fr 1fr;
      border-bottom: 1px solid #e8ecf1;
    }

    .compare-row:last-child {
      border-bottom: none;
    }

    .spec-label {
      padding: 16px;
      background: #f8f9fa;
      font-weight: 600;
      color: #2c3e50;
      font-size: 14px;
      display: flex;
      align-items: center;
    }

    .spec-value {
      padding: 16px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #7f8c8d;
    }

    .compare-actions {
      padding: 20px;
      background: #f8f9fa;
    }

    @media (max-width: 600px) {
      .compare-header,
      .compare-row {
        grid-template-columns: 100px 1fr 1fr;
      }
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonImg,
    IonTitle
  ]
})
export class CompareCarsPage implements OnInit {
  carsToCompare: Car[] = [];
  specs = [
    { key: 'price', label: 'Price' },
    { key: 'year', label: 'Year' },
    { key: 'mileage', label: 'Mileage' },
    { key: 'fuelType', label: 'Fuel Type' },
    { key: 'transmission', label: 'Transmission' },
    { key: 'type', label: 'Body Style' },
    { key: 'horsepower', label: 'Horsepower' },
    { key: 'mpgCombined', label: 'MPG' },
    { key: 'seats', label: 'Seats' },
    { key: 'exteriorColor', label: 'Exterior Color' },
    { key: 'interiorColor', label: 'Interior Color' },
    { key: 'condition', label: 'Condition' }
  ];

  private router = inject(Router);
  private carApi = inject(CarApiService);

  constructor() {
    addIcons({ arrowBackOutline, closeOutline, checkmarkOutline, carOutline });
  }

  ngOnInit() {
    this.loadComparisonFromStorage();
  }

  loadComparisonFromStorage() {
    const stored = localStorage.getItem('carsToCompare');
    if (stored) {
      const ids = JSON.parse(stored);
      this.loadCars(ids);
    }
  }

  loadCars(ids: string[]) {
    Promise.all(ids.map(id => (this.carApi as any).getCarById(id).toPromise())).then((cars: (Car | null)[]) => {
      this.carsToCompare = cars.filter((car): car is Car => car !== null);
      this.saveComparison();
    });
  }

  saveComparison() {
    const ids = this.carsToCompare.map(car => String(car.id));
    localStorage.setItem('carsToCompare', JSON.stringify(ids));
  }

  removeCar(index: number) {
    this.carsToCompare.splice(index, 1);
    this.saveComparison();
  }

  clearComparison() {
    this.carsToCompare = [];
    localStorage.removeItem('carsToCompare');
  }

  goBack() {
    window.history.back();
  }

  browseCars() {
    this.router.navigate(['/tabs/explore']);
  }

  getValue(car: Car, key: string): string {
    const value = (car as any)[key];
    if (value === undefined || value === null) return '-';
    if (key === 'price' || key === 'mileage') return value.toLocaleString();
    return String(value);
  }
}
