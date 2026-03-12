import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, receiptOutline, calendarOutline, checkmarkCircleOutline, timeOutline } from 'ionicons/icons';
import { FirestoreService, type Booking, type Order } from '../services/firestore.service';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonSpinner
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="goBack()">
            <ion-icon slot="icon-only" name="arrow-back-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>My Activity</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true" class="order-history-content">
      <div class="history-page">
        <ion-segment [(ngModel)]="activeTab" class="history-segment">
          <ion-segment-button value="orders">
            <ion-label>Orders</ion-label>
          </ion-segment-button>
          <ion-segment-button value="bookings">
            <ion-label>Bookings</ion-label>
          </ion-segment-button>
        </ion-segment>

        <div *ngIf="isLoading" class="loading-state">
          <ion-spinner name="crescent"></ion-spinner>
          <p>Loading your history...</p>
        </div>

        <div class="cards" *ngIf="!isLoading && activeTab === 'orders'">
          <ion-card class="history-card" *ngFor="let order of orders">
            <ion-card-content>
              <div class="history-card__top">
                <div>
                  <span class="eyebrow">Order</span>
                  <h3>{{ order.carName }}</h3>
                </div>
                <span class="pill" [class.pill--paid]="order.status === 'paid'">{{ order.status }}</span>
              </div>
              <div class="meta-row">
                <span>Reference</span>
                <strong>{{ order.paymentReference }}</strong>
              </div>
              <div class="meta-row">
                <span>Amount</span>
                <strong>\${{ order.amount | number:'1.0-2' }}</strong>
              </div>
              <div class="meta-row" *ngIf="order.paymentMethod">
                <span>Payment Method</span>
                <strong>{{ order.paymentMethod === 'bakong' ? 'KHQR (Bakong)' : 'Card' }}</strong>
              </div>
              <div class="meta-row" *ngIf="order.deliveryMethod">
                <span>Fulfilment</span>
                <strong>{{ order.deliveryMethod === 'home-delivery' ? 'Home delivery' : 'Showroom pickup' }}</strong>
              </div>
            </ion-card-content>
          </ion-card>

          <div class="empty-state" *ngIf="!orders.length">
            <ion-icon name="receipt-outline"></ion-icon>
            <p>No orders yet.</p>
          </div>
        </div>

        <div class="cards" *ngIf="!isLoading && activeTab === 'bookings'">
          <ion-card class="history-card" *ngFor="let booking of bookings">
            <ion-card-content>
              <div class="history-card__top">
                <div>
                  <span class="eyebrow">Booking</span>
                  <h3>{{ booking.userName }}</h3>
                </div>
                <span class="pill" [class.pill--paid]="booking.status === 'confirmed' || booking.status === 'completed'">
                  {{ booking.status }}
                </span>
              </div>
              <div class="meta-row">
                <span>Date</span>
                <strong>{{ getBookingDate(booking.startDate) | date:'medium' }}</strong>
              </div>
              <div class="meta-row">
                <span>Deposit</span>
                <strong>{{ booking.depositStatus || 'unpaid' }}</strong>
              </div>
              <div class="meta-row" *ngIf="booking.adminNote">
                <span>Admin note</span>
                <strong>{{ booking.adminNote }}</strong>
              </div>
            </ion-card-content>
          </ion-card>

          <div class="empty-state" *ngIf="!bookings.length">
            <ion-icon name="calendar-outline"></ion-icon>
            <p>No bookings yet.</p>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .history-page {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 18px;
      min-height: 100%;
    }
    
    .history-segment {
      margin-bottom: 16px;
      --background: #f5f7fa;
      --border-radius: 12px;
    }
    
    .order-history-content {
      --background: #f8fafc;
    }
    
    .cards {
      display: grid;
      gap: 14px;
      padding-bottom: 20px;
    }
    
    .history-card {
      margin: 0;
      border-radius: 18px;
      box-shadow: 0 10px 24px rgba(15,23,42,0.07);
    }
    
    .history-card__top {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: flex-start;
      margin-bottom: 12px;
    }
    
    .eyebrow {
      font-size: 11px;
      letter-spacing: .08em;
      text-transform: uppercase;
      color: #94a3b8;
    }
    
    .history-card h3 {
      margin: 6px 0 0;
      font-size: 18px;
      color: #0f172a;
    }
    
    .pill {
      padding: 7px 11px;
      border-radius: 999px;
      background: #fff7ed;
      color: #c2410c;
      font-size: 12px;
      font-weight: 700;
      text-transform: capitalize;
    }
    
    .pill--paid {
      background: #ecfdf5;
      color: #047857;
    }
    
    .meta-row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 9px 0;
      border-top: 1px solid #eef2f7;
      color: #64748b;
    }
    
    .meta-row:first-of-type {
      border-top: none;
    }
    
    .meta-row strong {
      text-align: right;
      color: #0f172a;
    }
    
    .loading-state,
    .empty-state {
      min-height: 40vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      color: #64748b;
      text-align: center;
    }
    
    .empty-state ion-icon {
      font-size: 52px;
      color: #cbd5e1;
    }
  `]
})
export class OrderHistoryPage implements OnInit {
  activeTab: 'orders' | 'bookings' = 'orders';
  orders: Order[] = [];
  bookings: Booking[] = [];
  isLoading = true;

  private firestoreService = inject(FirestoreService);
  private router = inject(Router);

  constructor() {
    addIcons({ arrowBackOutline, receiptOutline, calendarOutline, checkmarkCircleOutline, timeOutline });
  }

  async ngOnInit() {
    const user = this.firestoreService.getCurrentUser();
    if (!user?.uid) {
      this.router.navigate(['/auth'], { queryParams: { redirect: '/orders' } });
      return;
    }

    const [orders, bookings] = await Promise.all([
      this.firestoreService.getOrdersByUserId(user.uid),
      this.firestoreService.getBookingsByUserId(user.uid)
    ]);
    this.orders = orders;
    this.bookings = bookings;
    this.isLoading = false;
  }

  goBack() {
    this.router.navigate(['/tabs/account']);
  }

  getBookingDate(startDate: any): Date {
    // Handle both Timestamp objects and plain objects
    if (startDate?.toDate) {
      return startDate.toDate();
    } else if (startDate?.seconds) {
      return new Date(startDate.seconds * 1000);
    }
    return new Date();
  }
}
