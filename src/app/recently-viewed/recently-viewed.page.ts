import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonCard, IonCardContent, IonImg, IonChip
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, timeOutline, trashOutline, carOutline } from 'ionicons/icons';
import type { Car } from '../services/favorite.service';

@Component({
  selector: 'app-recently-viewed',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="goBack()">
            <ion-icon slot="icon-only" name="arrow-back-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Recently Viewed</ion-title>
        <ion-buttons slot="end" *ngIf="recentlyViewed.length > 0">
          <ion-button (click)="clearHistory()">
            <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div *ngIf="recentlyViewed.length === 0" class="empty-state">
        <ion-icon name="time-outline"></ion-icon>
        <h3>No Recently Viewed Cars</h3>
        <p>Cars you view will appear here</p>
        <ion-button (click)="browseCars()">Browse Cars</ion-button>
      </div>

      <div *ngIf="recentlyViewed.length > 0" class="cars-list">
        <ion-card *ngFor="let car of recentlyViewed" (click)="viewCar(car)" class="car-card">
          <ion-img [src]="car.image" [alt]="car.name"></ion-img>
          <ion-card-content>
            <h4>{{ car.year }} {{ car.brand }} {{ car.model }}</h4>
            <div class="price">\${{ car.price | number }}</div>
            <div class="car-details">
              <ion-chip>
                <ion-icon name="speed-outline"></ion-icon>
                {{ car.mileage | number }} mi
              </ion-chip>
              <ion-chip>
                {{ car.fuelType }}
              </ion-chip>
            </div>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 80vh;
      text-align: center;
      padding: 40px;
    }

    .empty-state ion-icon {
      font-size: 80px;
      color: #bdc3c7;
      margin-bottom: 24px;
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

    .cars-list {
      padding: 16px;
    }

    .car-card {
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      margin-bottom: 16px;
    }

    .car-card ion-img {
      height: 200px;
      object-fit: cover;
    }

    .car-card ion-card-content {
      padding: 16px;
    }

    .car-card h4 {
      margin: 0 0 8px 0;
      font-size: 17px;
      color: #2c3e50;
      font-weight: 600;
    }

    .price {
      font-size: 20px;
      font-weight: 700;
      color: #3498db;
      margin: 0 0 12px 0;
    }

    .car-details {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    ion-chip {
      font-size: 12px;
      height: 28px;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonImg,
    IonChip
  ]
})
export class RecentlyViewedPage implements OnInit {
  recentlyViewed: Car[] = [];

  constructor(private router: Router) {
    addIcons({ arrowBackOutline, timeOutline, trashOutline, carOutline });
  }

  ngOnInit() {
    this.loadRecentlyViewed();
  }

  loadRecentlyViewed() {
    const stored = localStorage.getItem('recentlyViewed');
    if (stored) {
      this.recentlyViewed = JSON.parse(stored);
    }
  }

  viewCar(car: Car) {
    this.router.navigate(['/car', car.id]);
  }

  goBack() {
    window.history.back();
  }

  clearHistory() {
    localStorage.removeItem('recentlyViewed');
    this.recentlyViewed = [];
  }

  browseCars() {
    this.router.navigate(['/tabs/explore']);
  }
}
