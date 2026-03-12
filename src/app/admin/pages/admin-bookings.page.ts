import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonToast
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendarOutline, checkmarkCircleOutline, closeCircleOutline, timeOutline } from 'ionicons/icons';
import { FirestoreService, type Booking } from '../../services/firestore.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonToast
  ],
  template: `
    <div class="page-wrap">
      <header class="top-bar">
        <div>
          <h2>Bookings</h2>
          <p>Approve, reject, and complete test-drive requests.</p>
        </div>
      </header>

      <div class="content">
        <ion-segment [(ngModel)]="statusFilter" (ionChange)="applyFilter()" class="filter-segment">
          <ion-segment-button value="all"><ion-label>All</ion-label></ion-segment-button>
          <ion-segment-button value="pending"><ion-label>Pending</ion-label></ion-segment-button>
          <ion-segment-button value="confirmed"><ion-label>Approved</ion-label></ion-segment-button>
          <ion-segment-button value="cancelled"><ion-label>Rejected</ion-label></ion-segment-button>
        </ion-segment>

        <div class="cards">
          <ion-card class="booking-card" *ngFor="let booking of filteredBookings">
            <ion-card-content>
              <div class="booking-top">
                <div>
                  <h3>{{ booking.userName }}</h3>
                  <p>{{ booking.userEmail }}</p>
                </div>
                <span class="pill" [class.pill--approved]="booking.status === 'confirmed' || booking.status === 'completed'">
                  {{ booking.status }}
                </span>
              </div>

              <div class="meta">
                <span><ion-icon name="calendar-outline"></ion-icon>{{ getBookingDate(booking.startDate) | date:'medium' }}</span>
                <span *ngIf="booking.phone">{{ booking.phone }}</span>
              </div>
              <div class="meta">
                <span>Deposit: {{ booking.depositStatus || 'unpaid' }}</span>
                <span *ngIf="booking.totalPrice">\${{ booking.totalPrice | number:'1.0-2' }}</span>
              </div>
              <p class="note" *ngIf="booking.notes">{{ booking.notes }}</p>
              <p class="note admin-note" *ngIf="booking.adminNote">{{ booking.adminNote }}</p>

              <div class="actions" *ngIf="booking.status === 'pending'">
                <ion-button size="small" (click)="updateBooking(booking, 'confirmed', 'Booking approved')">
                  Approve
                </ion-button>
                <ion-button size="small" fill="outline" color="danger" (click)="updateBooking(booking, 'cancelled', 'Booking rejected')">
                  Reject
                </ion-button>
              </div>
              <div class="actions" *ngIf="booking.status === 'confirmed'">
                <ion-button size="small" fill="outline" (click)="updateBooking(booking, 'completed', 'Test drive completed')">
                  Mark Complete
                </ion-button>
              </div>
            </ion-card-content>
          </ion-card>
        </div>

        <div class="empty-state" *ngIf="!filteredBookings.length">
          <ion-icon name="time-outline"></ion-icon>
          <p>No bookings in this status.</p>
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
    </div>
  `,
  styles: [`
    .page-wrap{flex:1;display:flex;flex-direction:column}
    .top-bar{background:#fff;padding:20px 36px;box-shadow:0 2px 12px rgba(0,0,0,0.06)}
    .top-bar h2{margin:0;font-size:26px;color:#2c3e50}
    .top-bar p{margin:4px 0 0;color:#7f8c8d;font-size:13px}
    .content{padding:28px 36px}
    .filter-segment{--background:#f5f7fa;--border-radius:12px;max-width:420px;margin-bottom:24px}
    .cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px}
    .booking-card{margin:0;border-radius:18px;box-shadow:0 10px 24px rgba(15,23,42,0.08)}
    .booking-top{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}
    .booking-top h3{margin:0;font-size:17px;color:#111827}
    .booking-top p{margin:4px 0 0;color:#64748b;font-size:13px}
    .pill{padding:7px 11px;border-radius:999px;background:#fff7ed;color:#c2410c;font-size:12px;font-weight:700;text-transform:capitalize}
    .pill--approved{background:#ecfdf5;color:#047857}
    .meta{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-top:10px;color:#475569;font-size:13px}
    .meta ion-icon{margin-right:4px}
    .note{margin:12px 0 0;color:#475569;font-size:13px;line-height:1.5}
    .admin-note{padding:10px 12px;border-radius:12px;background:#f8fafc}
    .actions{display:flex;gap:8px;margin-top:14px}
    .empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 20px;background:#fff;border-radius:16px;box-shadow:0 4px 16px rgba(0,0,0,0.06);text-align:center}
    .empty-state ion-icon{font-size:60px;color:#cbd5e1;margin-bottom:12px}
  `]
})
export class AdminBookingsPage implements OnInit {
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  statusFilter = 'all';
  showToast = false;
  toastMessage = '';
  toastColor = 'success';

  private firestoreService = inject(FirestoreService);
  private notificationService = inject(NotificationService);

  constructor() {
    addIcons({ calendarOutline, checkmarkCircleOutline, closeCircleOutline, timeOutline });
  }

  async ngOnInit() {
    this.bookings = await this.firestoreService.getAllBookings();
    this.applyFilter();
  }

  applyFilter() {
    this.filteredBookings =
      this.statusFilter === 'all'
        ? [...this.bookings]
        : this.bookings.filter((booking) => booking.status === this.statusFilter);
  }

  async updateBooking(booking: Booking, status: Booking['status'], label: string) {
    await this.firestoreService.updateBooking(
      booking.id,
      {
        status,
        adminNote:
          status === 'confirmed'
            ? 'Your booking is approved. Please arrive 10 minutes early.'
            : status === 'cancelled'
              ? 'Please choose another date or contact support.'
              : 'Thank you for visiting AutoElite.'
      },
      label,
      label
    );

    booking.status = status;
    booking.adminNote =
      status === 'confirmed'
        ? 'Your booking is approved. Please arrive 10 minutes early.'
        : status === 'cancelled'
          ? 'Please choose another date or contact support.'
          : 'Thank you for visiting AutoElite.';
    this.applyFilter();

    await this.notificationService.createInAppNotification({
      userId: booking.userId,
      title:
        status === 'confirmed'
          ? 'Test drive approved'
          : status === 'cancelled'
            ? 'Test drive update'
            : 'Test drive completed',
      body: booking.adminNote,
      icon: 'calendar-outline',
      route: '/orders',
      read: false,
      type: 'booking'
    });

    this.toastMessage = label;
    this.toastColor = status === 'cancelled' ? 'warning' : 'success';
    this.showToast = true;
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
