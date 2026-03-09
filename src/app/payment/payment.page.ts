import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { 
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonCard, IonCardContent, IonInput, IonToast, IonSpinner, IonImg, IonList, 
  IonItem, IonLabel, IonSegment, IonSegmentButton, IonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, checkmarkCircleOutline, closeCircleOutline, cardOutline, qrCodeOutline } from 'ionicons/icons';
import { CarApiService } from '../services/car-api.service';
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
            <div class="price">\${{ car.price | number }}</div>
          </div>
        </div>

        <!-- Payment Method -->
        <ion-segment [(ngModel)]="paymentMethod" class="payment-segment">
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
                  Pay \${{ car.price | number }}
                </ion-button>
              </form>
            </ion-card-content>
          </ion-card>
        </div>

        <!-- Bakong KHQR Payment -->
        <div class="bakong-payment" *ngIf="paymentMethod === 'bakong'">
          <ion-card>
            <ion-card-content>
              <div class="qr-header">
                <ion-icon name="qr-code-outline"></ion-icon>
                <h3>Scan to Pay</h3>
              </div>
              
              <div class="qr-container">
                <div class="qr-code">
                  <img [src]="bakongQrCode" alt="Bakong KHQR">
                </div>
                <p class="qr-instruction">Scan this QR code with your Bakong app or any KHQR-enabled banking app</p>
              </div>

              <div class="qr-details">
                <div class="qr-detail-item">
                  <span class="label">Amount:</span>
                  <span class="value">\${{ car.price | number }}</span>
                </div>
                <div class="qr-detail-item">
                  <span class="label">Merchant:</span>
                  <span class="value">Car Shop Dealership</span>
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
                I Have Paid
              </ion-button>

              <ion-text color="medium" class="payment-note">
                <p>* Payment confirmation may take a few minutes. You will receive a confirmation email once verified.</p>
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
    .payment-segment{margin-bottom:20px;--background:#f8f9fa;--border-radius:10px}
    .payment-form ion-card{border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,0.08)}
    .payment-form ion-input{--background:#f8f9fa;--border-radius:8px;margin-bottom:16px}
    .expiry-cvv{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .pay-btn{--border-radius:10px;--background:linear-gradient(135deg,#667eea,#764ba2);font-weight:600;margin-top:8px}
    .bakong-payment ion-card{border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,0.08)}
    .qr-header{display:flex;align-items:center;gap:12px;margin-bottom:20px}
    .qr-header ion-icon{font-size:32px;color:#667eea}
    .qr-header h3{margin:0;font-size:18px;color:#2c3e50}
    .qr-container{text-align:center;margin-bottom:24px}
    .qr-code{background:#fff;padding:20px;border-radius:12px;display:inline-block;margin-bottom:16px;box-shadow:0 2px 12px rgba(0,0,0,0.08)}
    .qr-code img{width:200px;height:200px;object-fit:contain}
    .qr-instruction{font-size:14px;color:#7f8c8d;margin:0}
    .qr-details{background:#f8f9fa;border-radius:12px;padding:16px;margin-bottom:20px}
    .qr-detail-item{display:flex;justify-content:space-between;margin-bottom:12px}
    .qr-detail-item:last-child{margin-bottom:0}
    .qr-detail-item .label{font-size:14px;color:#7f8c8d}
    .qr-detail-item .value{font-size:14px;font-weight:600;color:#2c3e50}
    .payment-note{font-size:13px;text-align:center;margin-top:16px}
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
    IonList,
    IonItem,
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonText
  ]
})
export class PaymentPage implements OnInit {
  car: Car | null = null;
  paymentMethod = 'card';
  cardForm: FormGroup;
  isProcessing = false;
  showToast = false;
  toastMessage = '';
  toastColor = 'success';
  bakongQrCode = '';
  paymentReference = '';

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private carApi = inject(CarApiService);

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
    this.generateBakongQR();
  }

  loadCar(id: string) {
    (this.carApi as any).getCarById(id).subscribe({
      next: (car: any) => {
        this.car = car;
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

  generateBakongQR() {
    // Generate a QR code using a QR code API
    // In production, you would integrate with actual Bakong API
    const qrData = {
      merchant: 'Car Shop Dealership',
      amount: this.car?.price || 0,
      reference: this.paymentReference,
      currency: 'USD'
    };
    // Using a placeholder QR code generator
    this.bakongQrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify(qrData))}`;
  }

  async payWithCard() {
    if (this.cardForm.invalid) {
      this.cardForm.markAllAsTouched();
      this.showToastMessage('Please fill in all card details', 'danger');
      return;
    }

    this.isProcessing = true;

    // Simulate payment processing
    setTimeout(() => {
      this.isProcessing = false;
      this.showToastMessage('Payment successful! Check your email for confirmation.', 'success');
      
      // Remove car from favorites if exists
      localStorage.removeItem('carsToCompare');
      
      setTimeout(() => {
        this.router.navigate(['/tabs/home']);
      }, 2000);
    }, 3000);
  }

  async confirmBakongPayment() {
    this.isProcessing = true;

    // Simulate payment verification
    setTimeout(() => {
      this.isProcessing = false;
      this.showToastMessage('Payment submitted for verification. You will receive confirmation soon.', 'success');
      
      setTimeout(() => {
        this.router.navigate(['/tabs/home']);
      }, 2000);
    }, 2000);
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
