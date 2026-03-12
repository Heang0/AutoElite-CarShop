import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
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
  IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, checkmarkCircleOutline, receiptOutline, carSportOutline } from 'ionicons/icons';
import { FirestoreService, type Order } from '../services/firestore.service';

@Component({
  selector: 'app-payment-success',
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
    IonSpinner
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="goHome()">
            <ion-icon slot="icon-only" name="arrow-back-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Payment Success</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <div class="success-page" *ngIf="!isLoading; else loadingTpl">
        <div class="success-hero">
          <div class="success-icon">
            <ion-icon name="checkmark-circle-outline"></ion-icon>
          </div>
          <h1>Payment confirmed</h1>
          <p>Your order is now in progress. You can track the status in your order history.</p>
        </div>

        <ion-card class="summary-card" *ngIf="order">
          <ion-card-content>
            <div class="summary-card__header">
              <div>
                <span class="eyebrow">Order summary</span>
                <h2>{{ order.carName }}</h2>
              </div>
              <span class="status">{{ order.status }}</span>
            </div>

            <div class="summary-row">
              <span>Reference</span>
              <strong>{{ order.paymentReference }}</strong>
            </div>
            <div class="summary-row">
              <span>Amount</span>
              <strong>\${{ order.amount | number:'1.0-2' }}</strong>
            </div>
            <div class="summary-row" *ngIf="order.deliveryMethod">
              <span>Fulfilment</span>
              <strong>{{ order.deliveryMethod === 'home-delivery' ? 'Home delivery' : 'Showroom pickup' }}</strong>
            </div>
            <div class="summary-row" *ngIf="order.buyerNote">
              <span>Buyer note</span>
              <strong>{{ order.buyerNote }}</strong>
            </div>
          </ion-card-content>
        </ion-card>

        <div class="actions">
          <ion-button expand="block" (click)="viewOrders()">
            <ion-icon slot="start" name="receipt-outline"></ion-icon>
            View Order History
          </ion-button>
          <ion-button expand="block" fill="outline" (click)="goHome()">
            <ion-icon slot="start" name="car-sport-outline"></ion-icon>
            Continue Browsing
          </ion-button>
        </div>
      </div>

      <ng-template #loadingTpl>
        <div class="loading-state">
          <ion-spinner name="crescent"></ion-spinner>
          <p>Loading order summary...</p>
        </div>
      </ng-template>
    </ion-content>
  `,
  styles: [`
    .success-page{padding:24px;display:flex;flex-direction:column;gap:20px}
    .success-hero{text-align:center;padding:24px;border-radius:24px;background:linear-gradient(180deg,#f0fdf4,#ffffff);box-shadow:0 14px 30px rgba(15,23,42,0.08)}
    .success-icon{width:82px;height:82px;border-radius:999px;margin:0 auto 16px;background:#dcfce7;display:flex;align-items:center;justify-content:center}
    .success-icon ion-icon{font-size:48px;color:#16a34a}
    .success-hero h1{margin:0 0 8px;font-size:28px;color:#0f172a}
    .success-hero p{margin:0;color:#64748b;line-height:1.6}
    .summary-card{margin:0;border-radius:20px;box-shadow:0 10px 26px rgba(15,23,42,0.08)}
    .summary-card__header{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:16px}
    .eyebrow{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#94a3b8}
    .summary-card h2{margin:6px 0 0;font-size:20px;color:#111827}
    .status{padding:8px 12px;border-radius:999px;background:#ecfdf5;color:#047857;font-size:12px;font-weight:700;text-transform:capitalize}
    .summary-row{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-top:1px solid #eef2f7;color:#475569}
    .summary-row:first-of-type{border-top:none}
    .summary-row strong{text-align:right;color:#0f172a}
    .actions{display:grid;gap:12px}
    .loading-state{min-height:60vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:#64748b}
  `]
})
export class PaymentSuccessPage implements OnInit {
  order: Order | null = null;
  isLoading = true;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private firestoreService = inject(FirestoreService);

  constructor() {
    addIcons({ arrowBackOutline, checkmarkCircleOutline, receiptOutline, carSportOutline });
  }

  async ngOnInit() {
    const orderId = this.route.snapshot.queryParamMap.get('orderId');
    if (orderId) {
      this.order = await this.firestoreService.getOrderById(orderId);
    }
    this.isLoading = false;
  }

  viewOrders() {
    this.router.navigate(['/orders']);
  }

  goHome() {
    this.router.navigate(['/tabs/home']);
  }
}
