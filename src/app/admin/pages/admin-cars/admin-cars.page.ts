import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonCard, IonCardContent, IonButton, IonIcon, IonInput, IonImg, IonSearchbar, IonToast } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { createOutline, trashOutline, carOutline, calendarOutline, speedometerOutline } from 'ionicons/icons';
import { CarApiService } from '../../../services/car-api.service';
import type { Car } from '../../../services/favorite.service';

@Component({
  selector: 'app-admin-cars',
  template: `
    <div class="cars-content">
      <header class="top-bar">
        <h2>All Cars</h2>
      </header>

      <div class="content">
        <!-- Search Bar -->
        <div class="search-bar">
          <ion-searchbar
            [(ngModel)]="searchQuery"
            (ionInput)="onSearch($event)"
            placeholder="Search cars..."
          ></ion-searchbar>
        </div>

        <!-- Cars Grid -->
        <div class="cars-grid">
          <ion-card *ngFor="let car of filteredCars" class="car-card">
            <ion-img [src]="car.image" [alt]="car.name"></ion-img>
            <ion-card-content>
              <h4>{{ car.name || 'Unnamed Car' }}</h4>
              <p class="price">\${{ formatNumber(car.price) }}</p>
              <div class="car-details">
                <span><ion-icon name="calendar-outline"></ion-icon> {{ formatNumber(car.year) }}</span>
                <span><ion-icon name="speedometer-outline"></ion-icon> {{ formatNumber(car.mileage) }} km</span>
              </div>
              <div class="car-actions">
                <ion-button fill="outline" size="small" (click)="editCar(car)">
                  <ion-icon slot="icon-only" name="create-outline"></ion-icon>
                </ion-button>
                <ion-button fill="outline" size="small" color="danger" (click)="deleteCar(car)">
                  <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
                </ion-button>
              </div>
            </ion-card-content>
          </ion-card>
        </div>

        <!-- Empty State -->
        <div *ngIf="filteredCars.length === 0 && !isLoading" class="empty-state">
          <ion-icon name="car-outline"></ion-icon>
          <p>No cars found</p>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <ion-toast
      [isOpen]="showToast"
      [message]="toastMessage"
      [duration]="2000"
      [color]="toastColor"
      position="top"
      (didDismiss)="showToast = false"
    ></ion-toast>
  `,
  styles: [`
    .cars-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .top-bar {
      background: white;
      padding: 20px 36px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    }

    .top-bar h2 {
      margin: 0;
      font-size: 26px;
      color: #2c3e50;
      font-weight: 600;
    }

    .content {
      flex: 1;
      padding: 32px 36px;
    }

    .search-bar {
      margin-bottom: 28px;
    }

    .search-bar ion-searchbar {
      --background: white;
      --border-radius: 12px;
      --box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    }

    .cars-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 28px;
    }

    .car-card {
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      margin: 0;
      background: white;
    }

    .car-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
    }

    .car-card ion-img {
      height: 200px;
      object-fit: cover;
    }

    .car-card ion-card-content {
      padding: 20px;
    }

    .car-card h4 {
      margin: 0 0 8px 0;
      font-size: 17px;
      color: #2c3e50;
      font-weight: 600;
    }

    .price {
      font-size: 22px;
      font-weight: 700;
      color: #3498db;
      margin: 0 0 16px 0;
    }

    .car-details {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
      font-size: 13px;
      color: #7f8c8d;
    }

    .car-details span {
      display: flex;
      align-items: center;
      background: #f5f7fa;
      padding: 6px 10px;
      border-radius: 8px;
    }

    .car-details ion-icon {
      margin-right: 6px;
      color: #3498db;
    }

    .car-actions {
      display: flex;
      gap: 8px;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 20px;
      text-align: center;
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    }

    .empty-state ion-icon {
      font-size: 72px;
      color: #bdc3c7;
      margin-bottom: 20px;
    }

    .empty-state p {
      color: #7f8c8d;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon,
    IonImg,
    IonSearchbar,
    IonToast
  ]
})
export class AdminCarsPage implements OnInit {
  cars: Car[] = [];
  filteredCars: Car[] = [];
  isLoading = false;
  searchQuery = '';
  showToast = false;
  toastMessage = '';
  toastColor = 'success';

  private carApi = inject(CarApiService);
  private router = inject(Router);

  constructor() {
    addIcons({ createOutline, trashOutline, carOutline, calendarOutline, speedometerOutline });
  }

  ngOnInit() {
    this.loadCars();
  }

  loadCars() {
    this.isLoading = true;
    this.carApi.getCars().subscribe({
      next: (cars) => {
        this.cars = cars;
        this.filteredCars = cars;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onSearch(event: any) {
    const query = this.searchQuery?.toLowerCase() || '';
    if (!query) {
      this.filteredCars = [...this.cars];
    } else {
      this.filteredCars = this.cars.filter(
        (car) =>
          car.name.toLowerCase().includes(query) ||
          car.brand.toLowerCase().includes(query) ||
          car.model.toLowerCase().includes(query)
      );
    }
  }

  editCar(car: Car) {
    console.log('Edit car:', car);
    // Navigate to add-car page with car ID for editing
    this.router.navigate(['/admin/add-car'], { 
      queryParams: { editId: String(car.id) }
    });
  }

  deleteCar(car: Car) {
    if (!confirm(`Are you sure you want to delete "${car.name}"?`)) {
      return;
    }

    this.carApi.deleteCar(String(car.id)).subscribe({
      next: () => {
        this.toastMessage = 'Car deleted successfully!';
        this.toastColor = 'success';
        this.showToast = true;
        this.loadCars();
      },
      error: (err) => {
        this.toastMessage = 'Failed to delete car: ' + err.message;
        this.toastColor = 'danger';
        this.showToast = true;
      }
    });
  }

  // Helper to safely format numbers
  formatNumber(value: any): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '0';
    }
    return String(value);
  }
}
