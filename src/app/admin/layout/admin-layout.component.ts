import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { IonIcon, IonAvatar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  speedometerOutline,
  addOutline,
  pricetagOutline,
  layersOutline,
  carOutline,
  receiptOutline,
  logOutOutline
} from 'ionicons/icons';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-admin-layout',
  template: `
    <div class="admin-wrapper">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <h1>🚗 Car Admin</h1>
        </div>
        <nav class="sidebar-nav">
          <a routerLink="/admin/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item">
            <ion-icon name="speedometer-outline"></ion-icon>
            <span>Dashboard</span>
          </a>
          <a routerLink="/admin/add-car" routerLinkActive="active" class="nav-item">
            <ion-icon name="add-outline"></ion-icon>
            <span>Add Car</span>
          </a>
          <a routerLink="/admin/brands" routerLinkActive="active" class="nav-item">
            <ion-icon name="pricetag-outline"></ion-icon>
            <span>Brands</span>
          </a>
          <a routerLink="/admin/categories" routerLinkActive="active" class="nav-item">
            <ion-icon name="layers-outline"></ion-icon>
            <span>Categories</span>
          </a>
          <a routerLink="/admin/cars" routerLinkActive="active" class="nav-item">
            <ion-icon name="car-outline"></ion-icon>
            <span>All Cars</span>
          </a>
          <a routerLink="/admin/orders" routerLinkActive="active" class="nav-item">
            <ion-icon name="receipt-outline"></ion-icon>
            <span>Orders</span>
          </a>
        </nav>
        <div class="sidebar-footer">
          <div class="admin-info">
            <ion-avatar>
              <div class="avatar-placeholder">{{ adminEmail.charAt(0) | uppercase }}</div>
            </ion-avatar>
            <span class="admin-email">{{ adminEmail }}</span>
          </div>
          <button (click)="logout()" class="logout-btn">
            <ion-icon name="log-out-outline"></ion-icon>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .admin-wrapper {
      display: flex;
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
    }

    .sidebar {
      width: 280px;
      background: linear-gradient(180deg, #1a252f 0%, #0f161d 100%);
      color: white;
      display: flex;
      flex-direction: column;
      position: fixed;
      height: 100vh;
      overflow: hidden;
      box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
      z-index: 100;
    }

    .sidebar-header {
      padding: 28px 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .sidebar-header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      background: linear-gradient(135deg, #3498db, #5dade2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .sidebar-nav {
      flex: 1;
      padding: 20px 0;
      overflow-y: auto;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 14px 24px;
      color: rgba(255, 255, 255, 0.65);
      text-decoration: none;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
    }

    .nav-item::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: #3498db;
      transform: scaleY(0);
      transition: transform 0.3s ease;
    }

    .nav-item:hover {
      background: rgba(255, 255, 255, 0.06);
      color: white;
      padding-left: 28px;
    }

    .nav-item:hover::before,
    .nav-item.active::before {
      transform: scaleY(1);
    }

    .nav-item.active {
      background: linear-gradient(90deg, rgba(52, 152, 219, 0.2), transparent);
      color: #5dade2;
      padding-left: 28px;
    }

    .nav-item ion-icon {
      font-size: 20px;
      margin-right: 14px;
    }

    .nav-item span {
      font-size: 15px;
      font-weight: 500;
    }

    .sidebar-footer {
      padding: 20px 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .admin-info {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      padding: 12px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
    }

    .admin-info ion-avatar {
      width: 44px;
      height: 44px;
      margin-right: 12px;
    }

    .avatar-placeholder {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #3498db, #2980b9);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 18px;
    }

    .admin-email {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.8);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .logout-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12px;
      background: rgba(231, 76, 60, 0.15);
      border: 1px solid rgba(231, 76, 60, 0.3);
      border-radius: 10px;
      color: #e74c3c;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 14px;
    }

    .logout-btn:hover {
      background: rgba(231, 76, 60, 0.25);
    }

    .logout-btn ion-icon {
      margin-right: 8px;
    }

    .main-content {
      margin-left: 280px;
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
  `],
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, IonIcon, IonAvatar]
})
export class AdminLayoutComponent {
  adminEmail = '';
  private firestoreService = inject(FirestoreService);
  private router = inject(Router);

  constructor() {
    addIcons({
      speedometerOutline,
      addOutline,
      pricetagOutline,
      layersOutline,
      carOutline,
      receiptOutline,
      logOutOutline
    });
  }

  ngOnInit() {
    this.firestoreService.onAuthStateChanged(async (user) => {
      if (!user) {
        this.router.navigate(['/admin-login']);
      } else {
        const isAdmin = await this.firestoreService.isCurrentUserAdmin();
        if (!isAdmin) {
          await this.firestoreService.signOut();
          this.router.navigate(['/admin-login']);
          return;
        }

        this.adminEmail = user.email || '';
      }
    });
  }

  async logout() {
    await this.firestoreService.signOut();
    this.router.navigate(['/admin-login']);
  }
}
