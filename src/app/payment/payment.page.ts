import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { 
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonCard, IonCardContent, IonInput, IonToast, IonSpinner, IonImg,
  IonLabel, IonSegment, IonSegmentButton, IonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, checkmarkCircleOutline, closeCircleOutline, cardOutline, qrCodeOutline } from 'ionicons/icons';
import { CarApiService } from '../services/car-api.service';
import { PaymentService, type BakongPaymentResponse } from '../services/payment.service';
import { FirestoreService } from '../services/firestore.service';
import { NotificationService } from '../services/notification.service';
import type { Car } from '../services/favorite.service';

@Component({
  selector: 'app-payment',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="goBack()">
            <ion-icon slot="icon-only" name="arrow-back-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Payment</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content *ngIf="car">
      <div class="payment-page">
        <!-- Car Summary -->
        <div class="car-summary">
          <ion-img [src]="car.image" [alt]="car.name"></ion-img>
          <div class="car-info">
            <h3>{{ car.year }} {{ car.brand }} {{ car.model }}</h3>
            <div class="price">\${{ paymentAmount | number }}</div>
            <div class="price-note" *ngIf="paymentType === 'deposit'">Deposit amount</div>
          </div>
        </div>

        <!-- Payment Method -->
        <ion-segment [(ngModel)]="paymentMethod" class="payment-segment" (ionChange)="onPaymentMethodChange($event.detail.value ?? null)">
          <ion-segment-button value="card">
            <ion-icon name="card-outline"></ion-icon>
            <ion-label>Card</ion-label>
          </ion-segment-button>
          <ion-segment-button value="bakong">
            <ion-icon name="qr-code-outline"></ion-icon>
            <ion-label>Bakong KHQR</ion-label>
          </ion-segment-button>
        </ion-segment>

        <!-- Card Payment -->
        <div class="payment-form" *ngIf="paymentMethod === 'card'">
          <ion-card>
            <ion-card-content>
              <form [formGroup]="cardForm">
                <ion-input
                  label="Card Number"
                  label-placement="stacked"
                  type="text"
                  formControlName="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  maxlength="19">
                </ion-input>

                <ion-input
                  label="Cardholder Name"
                  label-placement="stacked"
                  type="text"
                  formControlName="cardName"
                  placeholder="John Doe">
                </ion-input>

                <div class="expiry-cvv">
                  <ion-input
                    label="Expiry Date"
                    label-placement="stacked"
                    type="text"
                    formControlName="expiry"
                    placeholder="MM/YY"
                    maxlength="5">
                  </ion-input>

                  <ion-input
                    label="CVV"
                    label-placement="stacked"
                    type="password"
                    formControlName="cvv"
                    placeholder="123"
                    maxlength="4">
                  </ion-input>
                </div>

                <ion-button 
                  expand="block" 
                  (click)="payWithCard()" 
                  [disabled]="cardForm.invalid || isProcessing"
                  class="pay-btn">
                  <ion-spinner *ngIf="isProcessing" name="crescent" style="margin-right: 8px;"></ion-spinner>
                  Pay \${{ paymentAmount | number }}
                </ion-button>
              </form>
            </ion-card-content>
          </ion-card>
        </div>

        <!-- Bakong KHQR Payment -->
        <div class="bakong-payment" *ngIf="paymentMethod === 'bakong'">
          <ion-card>
            <div class="wallet-header">
              <img class="wallet-header-logo" [src]="khqrHeaderLogo" alt="KHQR logo">
            </div>
            <ion-card-content class="wallet-body">
              <div class="wallet-summary">
                <div class="wallet-summary__name">{{ merchantDisplayName }}</div>
                <div class="wallet-summary__amount">
                  <span class="currency">$</span>{{ paymentAmount | number:'1.0-2' }}
                </div>
              </div>

              <div class="wallet-divider"></div>
              
              <div class="qr-container">
                <div class="qr-code" *ngIf="!bakongLoading && bakongQrCode">
                  <img [src]="bakongQrCode" alt="Bakong KHQR">
                  <div class="qr-center-logo" aria-hidden="true">
                    <img
                      class="qr-center-logo__image"
                      [src]="bakongLogoUrl"
                      alt="Bakong logo"
                    >
                  </div>
                </div>
                <ion-spinner *ngIf="bakongLoading" name="crescent"></ion-spinner>
                <div class="qr-countdown" *ngIf="paymentMethod === 'bakong' && countdownLabel">
                  Expires in {{ countdownLabel }}
                </div>
                <p class="qr-instruction">Scan this QR code with Bakong or any KHQR-enabled banking app</p>
              </div>

              <div class="qr-details">
                <div class="qr-detail-item">
                  <span class="label">Amount:</span>
                  <span class="value">\${{ paymentAmount | number }}</span>
                </div>
                <div class="qr-detail-item" *ngIf="paymentType === 'deposit'">
                  <span class="label">Type:</span>
                  <span class="value">Deposit</span>
                </div>
                <div class="qr-detail-item">
                  <span class="label">Merchant:</span>
                  <span class="value">{{ bakongMerchantName }}</span>
                </div>
                <div class="qr-detail-item">
                  <span class="label">Reference:</span>
                  <span class="value">{{ paymentReference }}</span>
                </div>
              </div>

              <ion-button 
                expand="block" 
                (click)="confirmBakongPayment()" 
                [disabled]="isProcessing"
                class="pay-btn">
                <ion-spinner *ngIf="isProcessing" name="crescent" style="margin-right: 8px;"></ion-spinner>
                Check Payment Status
              </ion-button>

              <ion-text color="medium" class="payment-note">
                <p>* This screen checks your Bakong payment automatically every few seconds.</p>
              </ion-text>
            </ion-card-content>
          </ion-card>
        </div>
      </div>
    </ion-content>

    <ion-toast
      [isOpen]="showToast"
      [message]="toastMessage"
      [duration]="4000"
      [color]="toastColor"
      position="top"
      (didDismiss)="showToast = false"
    ></ion-toast>
  `,
  styles: [`
    .payment-page{padding:20px}
    .car-summary{display:flex;gap:16px;background:#fff;border-radius:12px;padding:16px;margin-bottom:20px;box-shadow:0 2px 12px rgba(0,0,0,0.08)}
    .car-summary ion-img{width:100px;height:100px;object-fit:cover;border-radius:8px}
    .car-info{flex:1;display:flex;flex-direction:column;justify-content:center}
    .car-info h3{margin:0 0 8px 0;font-size:16px;color:#2c3e50}
    .price{font-size:22px;font-weight:700;color:#3498db}
    .price-note{font-size:12px;color:#7f8c8d;margin-top:4px}
    .payment-segment{margin-bottom:20px;--background:#f8f9fa;--border-radius:10px}
    .payment-form ion-card{border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,0.08)}
    .payment-form ion-input{--background:#f8f9fa;--border-radius:8px;margin-bottom:16px}
    .expiry-cvv{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .pay-btn{--border-radius:14px;--background:linear-gradient(135deg,#e1232e,#b81821);font-weight:700;margin-top:8px}
    .bakong-payment ion-card{border-radius:28px;box-shadow:0 22px 40px rgba(15,23,42,0.12);overflow:hidden;background:#fff}
    .wallet-header{height:84px;background:#E1232E;border-radius:28px 28px 0 0;display:flex;align-items:center;justify-content:center;padding:12px 20px;position:relative}
    .wallet-header-logo{height:34px;width:auto;object-fit:contain;display:block}
    .wallet-body{padding:0 0 20px;position:relative;background:#fff}
    .wallet-body::before{content:'';position:absolute;top:0;right:0;width:78px;height:42px;background:#E1232E;clip-path:polygon(12% 0,100% 0,100% 100%)}
    .wallet-summary{padding:18px 20px 14px;position:relative;z-index:1}
    .wallet-summary__name{font-size:15px;font-weight:700;letter-spacing:.04em;color:#000;text-transform:uppercase}
    .wallet-summary__amount{margin-top:8px;font-size:42px;font-weight:800;line-height:1;color:#000;display:flex;align-items:flex-start;gap:3px}
    .wallet-summary__amount .currency{font-size:24px;line-height:1.2;font-weight:700}
    .wallet-divider{border-top:2px dashed rgba(148,163,184,0.4);margin:0 0 18px}
    .qr-container{text-align:center;margin-bottom:24px;padding:0 20px}
    .qr-code{background:#fff;padding:10px;border-radius:14px;display:inline-block;margin-bottom:16px;position:relative}
    .qr-code img{width:200px;height:200px;object-fit:contain;display:block}
    .qr-center-logo{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:46px;height:46px;border-radius:999px;background:#fff;box-shadow:0 10px 24px rgba(15,23,42,0.14);display:flex;align-items:center;justify-content:center;border:3px solid #fff;padding:0;overflow:hidden}
    .qr-center-logo__image{width:100%;height:100%;object-fit:cover;border-radius:999px;display:block}
    .qr-countdown{margin:0 auto 10px;width:fit-content;padding:7px 12px;border-radius:999px;background:#fff1f2;color:#b91c1c;font-size:13px;font-weight:700;letter-spacing:.04em}
    .qr-instruction{font-size:14px;line-height:1.5;color:#6b7280;margin:0 auto;max-width:240px}
    .qr-details{background:#f8fafc;border-radius:20px;padding:16px;margin-bottom:20px;border:1px solid #e5e7eb}
    .qr-detail-item{display:flex;justify-content:space-between;margin-bottom:12px}
    .qr-detail-item:last-child{margin-bottom:0}
    .qr-detail-item .label{font-size:14px;color:#6b7280}
    .qr-detail-item .value{font-size:14px;font-weight:600;color:#111827}
    .payment-note{font-size:13px;text-align:center;margin-top:16px}
    @media (max-width: 480px){.payment-page{padding:16px}.wallet-header{height:78px;padding:12px 16px}.wallet-header-logo{height:28px}.wallet-summary{padding:16px 16px 12px}.wallet-summary__amount{font-size:36px}.wallet-summary__amount .currency{font-size:21px}.qr-container{padding:0 16px}.qr-code img{width:180px;height:180px}.qr-center-logo{width:42px;height:42px}}
  `],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonInput,
    IonToast,
    IonSpinner,
    IonImg,
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonText
  ]
})
export class PaymentPage implements OnInit, OnDestroy {
  car: Car | null = null;
  paymentMethod = 'card';
  cardForm: FormGroup;
  isProcessing = false;
  showToast = false;
  toastMessage = '';
  toastColor = 'success';
  bakongQrCode = '';
  paymentReference = '';
  paymentId = '';
  paymentAmount = 0;
  paymentType = 'purchase';
  bookingId = '';
  orderId = '';
  expiresAt: number | null = null;
  countdownLabel = '';
  bakongMerchantName = 'AutoElite Motors';
  bakongLoading = false;
  readonly khqrHeaderLogo = 'assets/icon/KHQR Logo.png';
  readonly bakongLogoUrl = 'https://bakong.nbc.gov.kh/images/favicon.png';
  private bakongPayment?: BakongPaymentResponse;
  private paymentPollId: ReturnType<typeof setInterval> | null = null;
  private countdownIntervalId: ReturnType<typeof setInterval> | null = null;
  private hasHandledPaidStatus = false;

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private carApi = inject(CarApiService);
  private paymentService = inject(PaymentService);
  private firestoreService = inject(FirestoreService);
  private notificationService = inject(NotificationService);

  constructor() {
    addIcons({ arrowBackOutline, checkmarkCircleOutline, closeCircleOutline, cardOutline, qrCodeOutline });
    
    this.cardForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      cardName: ['', [Validators.required, Validators.minLength(3)]],
      expiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]]
    });
  }

  ngOnInit() {
    const carId = this.route.snapshot.paramMap.get('id');
    if (carId) {
      this.loadCar(carId);
    }
    this.generatePaymentReference();
    this.paymentAmount = Number(this.route.snapshot.queryParamMap.get('amount')) || 0;
    this.paymentType = this.route.snapshot.queryParamMap.get('type') || 'purchase';
    this.bookingId = this.route.snapshot.queryParamMap.get('bookingId') || '';
  }

  ngOnDestroy() {
    this.stopBakongPolling();
    this.stopCountdown();
  }

  get merchantDisplayName(): string {
    return (this.bakongMerchantName || 'AutoElite').toUpperCase();
  }

  loadCar(id: string) {
    (this.carApi as any).getCarById(id).subscribe({
      next: (car: any) => {
        this.car = car;
        if (!this.paymentAmount) {
          this.paymentAmount = car.price;
        }
      },
      error: () => {
        this.showToastMessage('Car not found', 'danger');
        this.goBack();
      }
    });
  }

  generatePaymentReference() {
    this.paymentReference = 'PAY-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
  }

  async loadBakongPayment() {
    if (!this.car || this.paymentAmount <= 0) {
      return;
    }

    this.bakongLoading = true;
    try {
      this.hasHandledPaidStatus = false;
      const user = this.firestoreService.getCurrentUser();
      if (!user) {
        this.showToastMessage('Please sign in to continue payment.', 'danger');
        this.router.navigate(['/auth'], { queryParams: { redirect: this.router.url } });
        return;
      }
      if (!user) {
        throw new Error('User not signed in');
      }

      const profile = await this.firestoreService.getUserProfile(user.uid);
      if (!profile?.phone || !profile?.address) {
        this.showToastMessage('Please add phone and address before paying.', 'danger');
        this.router.navigate(['/tabs/account']);
        return;
      }

      const payload = {
        amount: this.paymentAmount,
        currency: 'USD' as const,
        billNumber: this.paymentReference,
        purposeOfTransaction: this.paymentType === 'deposit' ? 'Test drive deposit' : 'Car purchase',
        carId: String(this.car.id),
        userId: user?.uid,
        expirationMinutes: 3
      };
      const response = await this.paymentService.createBakongPayment(payload);
      this.bakongPayment = response;
      this.bakongQrCode = response.qrImageUrl;
      this.paymentReference = response.reference;
      this.paymentId = response.paymentId;
      this.expiresAt = response.expiresAt;
      this.bakongMerchantName = response.merchantName || this.bakongMerchantName;
      this.startCountdown();
      this.startBakongPolling();

      if (!this.orderId) {
        this.orderId = await this.firestoreService.addOrder({
          carId: String(this.car.id),
          carName: `${this.car.brand} ${this.car.model}`,
          carImage: this.car.image,
          userId: user.uid,
          userName: profile.displayName || user.email || 'Customer',
          userEmail: user.email || '',
          phone: profile.phone || '',
          address: profile.address || '',
          amount: this.paymentAmount,
          currency: 'USD',
          paymentMethod: 'bakong',
          paymentReference: this.paymentReference,
          paymentType: this.paymentType as 'purchase' | 'deposit',
          bookingId: this.bookingId || undefined,
          status: response.status === 'paid' ? 'paid' : 'pending'
        });
      }
    } catch (error: any) {
      this.showToastMessage(error?.message || 'Unable to generate Bakong QR.', 'danger');
    } finally {
      this.bakongLoading = false;
    }
  }

  onPaymentMethodChange(method?: string | number | null) {
    this.paymentMethod = String(method) === 'bakong' ? 'bakong' : 'card';
    if (this.paymentMethod === 'bakong' && !this.bakongQrCode) {
      void this.loadBakongPayment();
      return;
    }
    if (this.paymentMethod === 'bakong') {
      this.startCountdown();
      this.startBakongPolling();
    } else {
      this.stopCountdown();
      this.stopBakongPolling();
    }
  }

  async payWithCard() {
    if (this.cardForm.invalid) {
      this.cardForm.markAllAsTouched();
      this.showToastMessage('Please fill in all card details', 'danger');
      return;
    }

    const user = this.firestoreService.getCurrentUser();
    if (!user) {
      this.showToastMessage('Please sign in to continue payment.', 'danger');
      this.router.navigate(['/auth'], { queryParams: { redirect: this.router.url } });
      return;
    }

    const profile = await this.firestoreService.getUserProfile(user.uid);
    if (!profile?.phone || !profile?.address) {
      this.showToastMessage('Please add phone and address before paying.', 'danger');
      this.router.navigate(['/tabs/account']);
      return;
    }

    this.isProcessing = true;
    await new Promise((resolve) => setTimeout(resolve, 2000));
    this.isProcessing = false;
    this.showToastMessage('Payment successful! Check your email for confirmation.', 'success');
    await this.createPaymentNotification('Card payment success', 'Your card payment was successful.');
    await this.createOrderForCardPayment();
    localStorage.removeItem('carsToCompare');
    setTimeout(() => {
      this.router.navigate(['/tabs/home']);
    }, 1500);
  }

  async confirmBakongPayment() {
    this.isProcessing = true;

    try {
      if (!this.paymentId) {
        await this.loadBakongPayment();
      }

      const result = await this.paymentService.confirmBakongPayment(this.paymentId);
      this.isProcessing = false;

      if (result.status === 'paid') {
        await this.handlePaidStatus();
      } else {
        this.showToastMessage('Payment is still pending. Keep this screen open.', 'primary');
      }

    } catch (error) {
      this.isProcessing = false;
      this.showToastMessage('Payment confirmation failed. Try again.', 'danger');
    }
  }

  private startBakongPolling() {
    this.stopBakongPolling();
    if (!this.paymentId) {
      return;
    }

    this.paymentPollId = setInterval(() => {
      void this.refreshBakongStatus();
    }, 4000);
  }

  private stopBakongPolling() {
    if (this.paymentPollId) {
      clearInterval(this.paymentPollId);
      this.paymentPollId = null;
    }
  }

  private startCountdown() {
    this.stopCountdown();
    this.updateCountdownLabel();
    if (!this.expiresAt || this.paymentMethod !== 'bakong') {
      return;
    }

    this.countdownIntervalId = setInterval(() => {
      this.updateCountdownLabel();
    }, 1000);
  }

  private stopCountdown() {
    if (this.countdownIntervalId) {
      clearInterval(this.countdownIntervalId);
      this.countdownIntervalId = null;
    }
  }

  private updateCountdownLabel() {
    if (!this.expiresAt) {
      this.countdownLabel = '';
      return;
    }

    const remainingMs = this.expiresAt - Date.now();
    if (remainingMs <= 0) {
      this.countdownLabel = '00:00';
      this.stopCountdown();
      return;
    }

    const totalSeconds = Math.ceil(remainingMs / 1000);
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    this.countdownLabel = `${minutes}:${seconds}`;
  }

  private async refreshBakongStatus() {
    if (!this.paymentId || this.hasHandledPaidStatus) {
      return;
    }

    try {
      const result = await this.paymentService.getBakongPaymentStatus(this.paymentId);
      if (result.status === 'paid') {
        await this.handlePaidStatus();
        return;
      }

      if (result.status === 'expired') {
        this.expiresAt = Date.now();
        this.updateCountdownLabel();
        this.stopCountdown();
        this.stopBakongPolling();
        this.showToastMessage('This QR code expired. Create a new payment.', 'warning');
      }
    } catch {
      // Ignore transient polling errors so the screen can keep retrying.
    }
  }

  private async handlePaidStatus() {
    if (this.hasHandledPaidStatus) {
      return;
    }

    this.hasHandledPaidStatus = true;
    this.stopBakongPolling();
    this.stopCountdown();
    this.showToastMessage('Payment confirmed successfully.', 'success');
    await this.createPaymentNotification('Payment confirmed', 'Your Bakong payment was confirmed.');
    if (this.orderId) {
      await this.firestoreService.updateOrderStatus(this.orderId, 'paid');
    }

    setTimeout(() => {
      this.router.navigate(['/tabs/home']);
    }, 1800);
  }

  private async createPaymentNotification(title: string, body: string) {
    const user = this.firestoreService.getCurrentUser();
    if (!user?.uid || !this.car) {
      return;
    }
    await this.notificationService.createInAppNotification({
      userId: user.uid,
      title,
      body,
      icon: 'qr-code-outline',
      route: `/car/${this.car.id}`,
      read: false,
      type: 'payment'
    });
  }

  private async createOrderForCardPayment() {
    if (!this.car) {
      return;
    }

    const user = this.firestoreService.getCurrentUser();
    if (!user) {
      return;
    }

    const profile = await this.firestoreService.getUserProfile(user.uid);
    if (!profile?.phone || !profile?.address) {
      this.showToastMessage('Please add phone and address before paying.', 'danger');
      this.router.navigate(['/tabs/account']);
      return;
    }

    if (!this.orderId) {
      this.orderId = await this.firestoreService.addOrder({
        carId: String(this.car.id),
        carName: `${this.car.brand} ${this.car.model}`,
        carImage: this.car.image,
        userId: user.uid,
        userName: profile.displayName || user.email || 'Customer',
        userEmail: user.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        amount: this.paymentAmount,
        currency: 'USD',
        paymentMethod: 'card',
        paymentReference: this.paymentReference,
        paymentType: this.paymentType as 'purchase' | 'deposit',
        bookingId: this.bookingId || undefined,
        status: 'paid'
      });
    }
  }

  goBack() {
    window.history.back();
  }

  showToastMessage(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }
}
