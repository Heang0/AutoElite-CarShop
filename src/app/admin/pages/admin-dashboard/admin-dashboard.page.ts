import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonCardContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { carOutline, cashOutline, trendingUpOutline } from 'ionicons/icons';
import { CarApiService } from '../../../services/car-api.service';
import type { Car } from '../../../services/favorite.service';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <div class="dashboard-content">
      <header class="top-bar">
        <h2>Dashboard</h2>
      </header>

      <div class="content">
        <!-- Stats Cards -->
        <div class="stats-container">
          <div class="stat-card">
            <div class="stat-icon">
              <ion-icon name="car-outline"></ion-icon>
            </div>
            <div class="stat-info">
              <h3>{{ totalCars }}</h3>
              <p>Total Cars</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <ion-icon name="cash-outline"></ion-icon>
            </div>
            <div class="stat-info">
              <h3>\${{ totalValue | number:'1.0-0' }}</h3>
              <p>Total Value</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <ion-icon name="trending-up-outline"></ion-icon>
            </div>
            <div class="stat-info">
              <h3>\${{ avgPrice | number:'1.0-0' }}</h3>
              <p>Avg Price</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-content {
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

    .stats-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 28px;
    }

    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 28px;
      display: flex;
      align-items: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    }

    .stat-icon {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #3498db, #2980b9);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20px;
      box-shadow: 0 4px 16px rgba(52, 152, 219, 0.3);
    }

    .stat-icon ion-icon {
      font-size: 30px;
      color: white;
    }

    .stat-info h3 {
      margin: 0;
      font-size: 32px;
      color: #2c3e50;
      font-weight: 700;
    }

    .stat-info p {
      margin: 6px 0 0 0;
      font-size: 14px;
      color: #7f8c8d;
    }
  `],
  standalone: true,
  imports: [CommonModule, IonIcon]
})
export class AdminDashboardPage implements OnInit {
  cars: Car[] = [];
  private carApi = inject(CarApiService);

  constructor() {
    addIcons({ carOutline, cashOutline, trendingUpOutline });
  }

  ngOnInit() {
    this.loadCars();
  }

  loadCars() {
    this.carApi.getCars().subscribe({
      next: (cars) => {
        this.cars = cars;
      }
    });
  }

  get totalCars() {
    return this.cars.length;
  }

  get totalValue() {
    return this.cars.reduce((sum, car) => sum + car.price, 0);
  }

  get avgPrice() {
    return this.cars.length ? this.totalValue / this.cars.length : 0;
  }
}
