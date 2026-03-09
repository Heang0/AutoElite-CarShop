import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonImg,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonToast
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  checkmarkCircleOutline,
  closeCircleOutline,
  timeOutline,
  cashOutline,
  receiptOutline
} from 'ionicons/icons';
import { FirestoreService, type Order } from '../../services/firestore.service';

@Component({
  selector: 'app-admin-orders',
  template: `
    <div class="orders-content">
      <header class="top-bar">
        <div>
          <h2>Orders</h2>
          <p>Track incoming payments and deposits</p>
        </div>
      </header>

      <div class="content">
        <ion-segment [(ngModel)]="statusFilter" (ionChange)="applyFilter()" class="filter-segment">
          <ion-segment-button value="all">
            <ion-label>All</ion-label>
          </ion-segment-button>
          <ion-segment-button value="pending">
            <ion-label>Pending</ion-label>
          </ion-segment-button>
          <ion-segment-button value="paid">
            <ion-label>Paid</ion-label>
          </ion-segment-button>
        </ion-segment>

        <div class="orders-grid">
          <ion-card *ngFor="let order of filteredOrders" class="order-card">
            <div class="order-hero">
              <ion-img [src]="order.carImage || fallbackImage" [alt]="order.carName"></ion-img>
              <div class="order-status" [class.paid]="order.status === 'paid'">
                <ion-icon [name]="order.status === 'paid' ? 'checkmark-circle-outline' : 'time-outline'"></ion-icon>
                <span>{{ order.status }}</span>
              </div>
            </div>
            <ion-card-content>
              <div class="order-title">
                <h3>{{ order.carName }}</h3>
                <span class="amount">\${{ order.amount | number }}</span>
              </div>
              <div class="order-meta">
                <span><ion-icon name="receipt-outline"></ion-icon> {{ order.paymentReference }}</span>
                <span><ion-icon name="cash-outline"></ion-icon> {{ formatMethod(order.paymentMethod) }}</span>
              </div>
              <div class="order-meta">
                <span>{{ formatDate(order.createdAt.toDate()) }}</span>
                <span *ngIf="order.paymentType">{{ order.paymentType }}</span>
              </div>
              <div class="buyer-info">
                <p>{{ order.userName }}</p>
                <p>{{ order.userEmail }}</p>
                <p *ngIf="order.phone">{{ order.phone }}</p>
                <p *ngIf="order.address">{{ order.address }}</p>
              </div>

              <div class="order-actions" *ngIf="order.status === 'pending'">
                <ion-button size="small" fill="outline" (click)="updateStatus(order, 'paid')">
                  Mark Paid
                </ion-button>
                <ion-button size="small" color="danger" fill="outline" (click)="updateStatus(order, 'cancelled')">
                  Cancel
                </ion-button>
              </div>
            </ion-card-content>
          </ion-card>
        </div>

        <div *ngIf="!filteredOrders.length && !isLoading" class="empty-state">
          <ion-icon name="receipt-outline"></ion-icon>
          <p>No orders found</p>
        </div>
      </div>
    </div>

    <ion-toast
      [isOpen]="showToast"
      [message]="toastMessage"
      [duration]="2500"
      [color]="toastColor"
      position="top"
      (didDismiss)="showToast = false"
    ></ion-toast>
  `,
  styles: [`
    .orders-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .top-bar {
      background: white;
      padding: 20px 36px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .top-bar h2 {
      margin: 0;
      font-size: 26px;
      color: #2c3e50;
      font-weight: 600;
    }

    .top-bar p {
      margin: 4px 0 0;
      color: #7f8c8d;
      font-size: 13px;
    }

    .content {
      flex: 1;
      padding: 28px 36px;
    }

    .filter-segment {
      --background: #f5f7fa;
      --border-radius: 12px;
      margin-bottom: 24px;
      max-width: 360px;
    }

    .orders-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
    }

    .order-card {
      margin: 0;
      border-radius: 16px;
      overflow: hidden;
      background: white;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    }

    .order-hero {
      position: relative;
      height: 180px;
      overflow: hidden;
    }

    .order-hero ion-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .order-status {
      position: absolute;
      top: 12px;
      right: 12px;
      background: rgba(243, 244, 246, 0.95);
      color: #64748b;
      padding: 6px 10px;
      border-radius: 999px;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 600;
    }

    .order-status.paid {
      background: rgba(16, 185, 129, 0.15);
      color: #059669;
    }

    .order-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .order-title h3 {
      margin: 0;
      font-size: 16px;
      color: #1f2937;
    }

    .amount {
      font-weight: 700;
      color: #0f172a;
    }

    .order-meta {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 8px;
      font-size: 12px;
      color: #64748b;
    }

    .order-meta ion-icon {
      margin-right: 4px;
    }

    .buyer-info {
      margin-top: 12px;
      font-size: 12px;
      color: #475569;
    }

    .buyer-info p {
      margin: 2px 0;
    }

    .order-actions {
      display: flex;
      gap: 8px;
      margin-top: 12px;
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
      font-size: 64px;
      color: #cbd5f5;
      margin-bottom: 16px;
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
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonToast
  ]
})
export class AdminOrdersPage implements OnInit, OnDestroy {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  statusFilter = 'all';
  isLoading = false;
  showToast = false;
  toastMessage = '';
  toastColor = 'success';
  fallbackImage =
    'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80';

  private firestoreService = inject(FirestoreService);
  private refreshTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    addIcons({
      checkmarkCircleOutline,
      closeCircleOutline,
      timeOutline,
      cashOutline,
      receiptOutline
    });
  }

  ngOnInit() {
    void this.loadOrders();
    this.refreshTimer = setInterval(() => {
      void this.loadOrders();
    }, 10000);
  }

  ngOnDestroy() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  async loadOrders() {
    this.isLoading = true;
    try {
      this.orders = await this.firestoreService.getOrders();
      this.applyFilter();
    } catch (error: any) {
      this.toastMessage = 'Failed to load orders';
      this.toastColor = 'danger';
      this.showToast = true;
    } finally {
      this.isLoading = false;
    }
  }

  applyFilter() {
    if (this.statusFilter === 'all') {
      this.filteredOrders = [...this.orders];
      return;
    }
    this.filteredOrders = this.orders.filter((order) => order.status === this.statusFilter);
  }

  async updateStatus(order: Order, status: Order['status']) {
    await this.firestoreService.updateOrderStatus(order.id, status);
    order.status = status;
    this.applyFilter();
    this.toastMessage = `Order marked as ${status}`;
    this.toastColor = status === 'paid' ? 'success' : 'medium';
    this.showToast = true;
  }

  formatDate(date: Date) {
    return date.toLocaleString();
  }

  formatMethod(method: Order['paymentMethod']) {
    return method === 'bakong' ? 'ABA KHQR' : 'CARD';
  }
}
