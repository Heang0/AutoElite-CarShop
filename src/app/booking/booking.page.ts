import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  IonInput,
  IonTextarea,
  IonDatetime,
  IonToast,
  IonSpinner,
  IonImg,
  IonLabel,
  IonItem
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  calendarOutline,
  timeOutline,
  locationOutline,
  callOutline,
  checkmarkCircleOutline,
  carSportOutline,
  informationCircleOutline,
  warningOutline
} from 'ionicons/icons';
import { FirestoreService } from '../services/firestore.service';
import { FavoriteService, type Car } from '../services/favorite.service';
import { CarApiService } from '../services/car-api.service';
import { Timestamp, collection, addDoc, getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-booking',
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
    IonTextarea,
    IonToast,
    IonSpinner,
    IonImg
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="goBack()">
            <ion-icon slot="icon-only" name="arrow-back-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Book Test Drive</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content *ngIf="car">
      <div class="booking-page">
        <!-- Car Summary -->
        <div class="car-summary">
          <ion-img [src]="car.image" [alt]="car.name"></ion-img>
          <div class="car-info">
            <h3>{{ car.year }} {{ car.brand }} {{ car.model }}</h3>
            <div class="price">\${{ car.price | number }}</div>
          </div>
        </div>

        <!-- Booking Form -->
        <ion-card class="booking-card">
          <ion-card-content>
            <h3>Test Drive Booking</h3>
            <p class="subtitle">Schedule your test drive appointment</p>

            <form [formGroup]="bookingForm">
              <!-- Date Selection -->
              <ion-input
                label="Preferred Date *"
                label-placement="stacked"
                type="date"
                formControlName="date"
                [min]="minDate"
                color="success">
              </ion-input>
              <div class="error-message" *ngIf="bookingForm.get('date')?.invalid && bookingForm.get('date')?.touched">
                <ion-icon name="warning-outline"></ion-icon>
                <span>Please select a date</span>
              </div>

              <!-- Time Selection -->
              <ion-input
                label="Preferred Time *"
                label-placement="stacked"
                type="time"
                formControlName="time"
                color="success">
              </ion-input>
              <div class="error-message" *ngIf="bookingForm.get('time')?.invalid && bookingForm.get('time')?.touched">
                <ion-icon name="warning-outline"></ion-icon>
                <span>Please select a time</span>
              </div>

              <!-- Pickup Location -->
              <ion-input
                label="Pickup Location *"
                label-placement="stacked"
                formControlName="pickupLocation"
                placeholder="e.g., AutoElite Showroom, Phnom Penh"
                color="success">
              </ion-input>
              <div class="error-message" *ngIf="bookingForm.get('pickupLocation')?.invalid && bookingForm.get('pickupLocation')?.touched">
                <ion-icon name="warning-outline"></ion-icon>
                <span>Please enter a location (at least 5 characters)</span>
              </div>

              <!-- Phone Number -->
              <ion-input
                label="Phone Number *"
                label-placement="stacked"
                type="tel"
                formControlName="phone"
                placeholder="+855 12 345 678"
                color="success">
              </ion-input>
              <div class="error-message" *ngIf="bookingForm.get('phone')?.invalid && bookingForm.get('phone')?.touched">
                <ion-icon name="warning-outline"></ion-icon>
                <span>Please enter a valid phone number</span>
              </div>

              <!-- Notes -->
              <ion-textarea
                label="Additional Notes (Optional)"
                label-placement="stacked"
                formControlName="notes"
                auto-grow="true"
                rows="3"
                placeholder="Any special requests or questions..."
                color="success">
              </ion-textarea>

              <!-- Booking Summary -->
              <div class="booking-summary">
                <div class="summary-row">
                  <span>Test Drive Duration</span>
                  <strong>1 hour</strong>
                </div>
                <div class="summary-row">
                  <span>Refundable Deposit</span>
                  <strong class="deposit-amount">$100</strong>
                </div>
                <div class="summary-note">
                  <ion-icon name="information-circle-outline"></ion-icon>
                  <span>Deposit is fully refundable after test drive</span>
                </div>
              </div>

              <!-- Submit Button -->
              <ion-button
                expand="block"
                (click)="submitBooking()"
                [disabled]="bookingForm.invalid || isProcessing"
                class="submit-btn">
                <ion-spinner *ngIf="isProcessing" name="crescent" style="margin-right: 8px;"></ion-spinner>
                <ion-icon slot="start" name="calendar-outline" *ngIf="!isProcessing"></ion-icon>
                Book Test Drive
              </ion-button>
            </form>
          </ion-card-content>
        </ion-card>

        <!-- Info Card -->
        <ion-card class="info-card">
          <ion-card-content>
            <h4>What to Expect</h4>
            <ul class="info-list">
              <li>
                <ion-icon name="checkmark-circle-outline"></ion-icon>
                <span>Bring your valid driver's license</span>
              </li>
              <li>
                <ion-icon name="checkmark-circle-outline"></ion-icon>
                <span>Arrive 10 minutes early for paperwork</span>
              </li>
              <li>
                <ion-icon name="checkmark-circle-outline"></ion-icon>
                <span>Professional staff will accompany you</span>
              </li>
              <li>
                <ion-icon name="checkmark-circle-outline"></ion-icon>
                <span>Deposit is fully refundable</span>
              </li>
            </ul>
          </ion-card-content>
        </ion-card>
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
    .booking-page {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: #f8fafc;
      min-height: 100%;
    }

    .car-summary {
      display: flex;
      gap: 16px;
      background: #fff;
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
      border: 1px solid #e2e8f0;
    }

    .car-summary ion-img {
      width: 100px;
      height: 100px;
      object-fit: cover;
      border-radius: 8px;
    }

    .car-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .car-info h3 {
      margin: 0 0 8px 0;
      font-size: 16px;
      color: #2c3e50;
    }

    .price {
      font-size: 20px;
      font-weight: 700;
      color: #3498db;
    }

    .booking-card {
      margin: 0;
      border-radius: 18px;
      box-shadow: 0 10px 28px rgba(15,23,42,0.08);
      background: #ffffff;
      border: 1px solid #e2e8f0;
    }

    .booking-card h3 {
      margin: 0 0 4px 0;
      font-size: 22px;
      color: #1e293b;
      font-weight: 700;
    }

    .subtitle {
      margin: 0 0 20px 0;
      color: #64748b;
      font-size: 14px;
    }

    .booking-card ion-input,
    .booking-card ion-textarea {
      --background: #f8fafc;
      --border-radius: 8px;
      --highlight-color-focused: #10b981;
      margin-bottom: 4px;
      --padding-start: 12px;
      --padding-end: 12px;
      --padding-top: 12px;
      --padding-bottom: 12px;
      border: 1px solid #e2e8f0;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #ef4444;
      font-size: 13px;
      margin-top: -12px;
      margin-bottom: 12px;
      padding-left: 12px;
    }

    .error-message ion-icon {
      font-size: 16px;
    }

    .booking-summary {
      background: #f8fafc;
      border-radius: 12px;
      padding: 16px;
      margin: 20px 0;
      border: 1px solid #e2e8f0;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
      color: #475569;
    }

    .summary-row strong {
      color: #0f172a;
    }

    .deposit-amount {
      color: #10b981 !important;
      font-weight: 700 !important;
    }

    .summary-note {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #e2e8f0;
      font-size: 13px;
      color: #64748b;
    }

    .summary-note ion-icon {
      color: #3b82f6;
      flex-shrink: 0;
    }

    .submit-btn {
      --border-radius: 14px;
      --background: linear-gradient(135deg, #10b981, #059669);
      --background-activated: linear-gradient(135deg, #059669, #047857);
      font-weight: 700;
      margin-top: 8px;
      --padding-top: 14px;
      --padding-bottom: 14px;
      font-size: 16px;
      letter-spacing: 0.3px;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }

    .submit-btn:disabled {
      --background: #94a3b8;
      opacity: 0.6;
    }

    .info-card {
      margin: 0;
      border-radius: 18px;
      box-shadow: 0 10px 28px rgba(15,23,42,0.08);
      background: #f0f9ff;
      border: 1px solid #bae6fd;
    }

    .info-card h4 {
      margin: 0 0 16px 0;
      font-size: 18px;
      color: #0c4a6e;
    }

    .info-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .info-list li {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      font-size: 14px;
      color: #164e63;
    }

    .info-list li ion-icon {
      color: #10b981;
      font-size: 20px;
      flex-shrink: 0;
      margin-top: 2px;
    }
  `]
})
export class BookingPage implements OnInit {
  car: Car | null = null;
  bookingForm: FormGroup;
  isProcessing = false;
  showToast = false;
  toastMessage = '';
  toastColor = 'success';
  minDate = '';

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private firestoreService = inject(FirestoreService);
  private favoriteService = inject(FavoriteService);
  private carApi = inject(CarApiService);
  private fb = inject(FormBuilder);
  private db = getFirestore(initializeApp(environment.firebase));

  constructor() {
    addIcons({
      arrowBackOutline,
      calendarOutline,
      timeOutline,
      locationOutline,
      callOutline,
      checkmarkCircleOutline,
      carSportOutline,
      informationCircleOutline,
      warningOutline
    });

    this.bookingForm = this.fb.group({
      date: ['', [Validators.required]],
      time: ['', [Validators.required]],
      pickupLocation: ['', [Validators.required, Validators.minLength(5)]],
      phone: ['', [Validators.required, Validators.pattern(/^[+]?[0-9\s-]{8,15}$/)]],
      notes: ['']
    });

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    this.minDate = today;
  }

  ngOnInit() {
    const carId = this.route.snapshot.paramMap.get('id');
    if (carId) {
      this.loadCar(carId);
    }
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

  goBack() {
    // Navigate to car detail page instead of using browser back
    if (this.car?.id) {
      this.router.navigate(['/car', this.car.id]);
    } else {
      // Fallback to home if no car
      this.router.navigate(['/tabs/home']);
    }
  }

  async submitBooking() {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      this.showToastMessage('Please fill in all required fields', 'danger');
      return;
    }

    const user = this.firestoreService.getCurrentUser();
    if (!user) {
      this.showToastMessage('Please sign in to book a test drive', 'danger');
      this.router.navigate(['/auth'], { queryParams: { redirect: this.router.url } });
      return;
    }

    this.isProcessing = true;

    try {
      const formValue = this.bookingForm.value;
      
      // Ensure date and time are valid
      if (!formValue.date || !formValue.time) {
        this.showToastMessage('Please select date and time', 'danger');
        this.isProcessing = false;
        return;
      }
      
      const startDate = new Date(`${formValue.date}T${formValue.time}`);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration

      const profile = await this.firestoreService.getUserProfile(user.uid);

      // Build booking data - NO createdAt (added by service)
      const bookingData: any = {
        carId: String(this.car!.id),
        userId: user.uid,
        userName: profile?.displayName || user.email || 'Customer',
        userEmail: user.email || '',
        startDate: Timestamp.fromDate(startDate),
        endDate: Timestamp.fromDate(endDate),
        pickupLocation: formValue.pickupLocation || 'AutoElite Showroom',
        status: 'pending',
        totalPrice: 0,
        depositAmount: 100,
        depositStatus: 'unpaid',
        bookingType: 'test-drive',
        phone: formValue.phone || '',
        notes: formValue.notes || '',
        adminNote: ''
      };
      
      // Log for debugging
      console.log('Booking data before clean:', bookingData);
      
      // Clean data - replace undefined but keep Timestamps as-is
      const cleanData: any = {};
      Object.keys(bookingData).forEach(key => {
        const value = bookingData[key];
        if (value === undefined) {
          cleanData[key] = '';
        } else if (value?.constructor?.name === 'Timestamp') {
          // Keep Timestamp objects as-is
          cleanData[key] = value;
        } else {
          cleanData[key] = value;
        }
      });
      
      console.log('Booking data after clean:', cleanData);
      console.log('startDate type:', cleanData.startDate?.constructor?.name);
      console.log('endDate type:', cleanData.endDate?.constructor?.name);

      // Save directly to Firestore (bypass service to avoid undefined issues)
      try {
        const bookingsCollection = collection(this.db, 'bookings');
        const docRef = await addDoc(bookingsCollection, {
          carId: cleanData.carId,
          userId: cleanData.userId,
          userName: cleanData.userName,
          userEmail: cleanData.userEmail,
          startDate: cleanData.startDate,
          endDate: cleanData.endDate,
          pickupLocation: cleanData.pickupLocation,
          status: cleanData.status,
          totalPrice: cleanData.totalPrice,
          depositAmount: cleanData.depositAmount,
          depositStatus: cleanData.depositStatus,
          bookingType: cleanData.bookingType,
          phone: cleanData.phone,
          notes: cleanData.notes,
          adminNote: cleanData.adminNote,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
        const bookingId = docRef.id;
        console.log('Booking saved with ID:', bookingId);

        // Create notification for admin (only if user is signed in)
        if (user) {
          await this.firestoreService.addNotification({
            userId: user.uid,
            title: 'Test Drive Booking Submitted',
            body: `Your test drive request for ${this.car!.brand} ${this.car!.model} has been submitted.`,
            icon: 'calendar-outline',
            route: '/tabs/account',
            read: false,
            type: 'booking'
          });
        }

        this.showToastMessage('Booking created! Proceed to pay deposit.', 'success');

        // Redirect to payment page for deposit
        setTimeout(() => {
          this.router.navigate(['/payment', this.car!.id], {
            queryParams: {
              type: 'deposit',
              amount: 100,  // Deposit amount
              bookingId: bookingId
            }
          });
        }, 1500);
      } catch (error: any) {
        console.error('Firestore save error:', error);
        this.showToastMessage(error.message || 'Failed to create booking', 'danger');
      } finally {
        this.isProcessing = false;
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      this.showToastMessage(error.message || 'Failed to create booking', 'danger');
      this.isProcessing = false;
    }
  }

  showToastMessage(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }
}
