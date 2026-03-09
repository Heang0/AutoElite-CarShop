import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonCard, IonCardContent, IonInput, IonTextarea, IonButton, IonIcon, IonDatetime, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonList, IonItem, IonLabel, IonToast } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, callOutline, calendarOutline, sendOutline, closeOutline, checkmarkOutline } from 'ionicons/icons';
import { FirestoreService } from '../../services/firestore.service';
import type { Car } from '../../services/favorite.service';

@Component({
  selector: 'app-contact-dealer',
  template: `
    <div class="contact-dealer">
      <div class="contact-header">
        <ion-icon name="mail-outline"></ion-icon>
        <h3>Contact Dealer</h3>
      </div>

      <div class="contact-body">
        <form #contactForm="ngForm">
          <ion-input
            label="Name"
            labelPlacement="stacked"
            type="text"
            [(ngModel)]="name"
            name="name"
            required
            placeholder="Your full name">
          </ion-input>

          <ion-input
            label="Email"
            label-placement="stacked"
            type="email"
            [(ngModel)]="email"
            name="email"
            required
            placeholder="your@email.com">
          </ion-input>

          <ion-input
            label="Phone"
            label-placement="stacked"
            type="tel"
            [(ngModel)]="phone"
            name="phone"
            placeholder="(123) 456-7890">
          </ion-input>

          <ion-input
            label="Interested In"
            label-placement="stacked"
            type="text"
            [value]="carName"
            disabled>
          </ion-input>

          <ion-textarea
            label="Message"
            label-placement="stacked"
            [(ngModel)]="message"
            name="message"
            rows="4"
            placeholder="I'm interested in this vehicle..."
            required>
          </ion-textarea>

          <ion-button expand="block" (click)="sendMessage()" [disabled]="!name || !email || !message">
            <ion-icon slot="start" name="send-outline"></ion-icon>
            Send Message
          </ion-button>
        </form>

        <div class="dealer-contact">
          <h4>Or contact directly:</h4>
          <a [href]="'tel:' + dealerPhone" class="contact-link">
            <ion-icon name="call-outline"></ion-icon>
            {{ dealerPhone }}
          </a>
          <a [href]="'mailto:' + dealerEmail" class="contact-link">
            <ion-icon name="mail-outline"></ion-icon>
            {{ dealerEmail }}
          </a>
        </div>
      </div>
    </div>

    <!-- Schedule Test Drive Modal -->
    <ion-modal [isOpen]="showTestDriveModal" (didDismiss)="showTestDriveModal = false">
      <ng-template>
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-button (click)="showTestDriveModal = false">
                <ion-icon slot="icon-only" name="close-outline"></ion-icon>
              </ion-button>
            </ion-buttons>
            <ion-title>Schedule Test Drive</ion-title>
            <ion-buttons slot="end">
              <ion-button (click)="scheduleTestDrive()" [disabled]="!testDriveDate || !testDriveName || !testDrivePhone">
                <ion-icon slot="icon-only" name="checkmark-outline"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="form-content">
          <ion-list>
            <ion-item>
              <ion-label position="stacked">Your Name</ion-label>
              <ion-input [(ngModel)]="testDriveName" type="text" placeholder="John Doe"></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Phone Number</ion-label>
              <ion-input [(ngModel)]="testDrivePhone" type="tel" placeholder="(123) 456-7890"></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Email</ion-label>
              <ion-input [(ngModel)]="testDriveEmail" type="email" placeholder="john@example.com"></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Preferred Date</ion-label>
              <ion-input [(ngModel)]="testDriveDate" type="date"></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Preferred Time</ion-label>
              <ion-input [(ngModel)]="testDriveTime" type="time"></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Notes (optional)</ion-label>
              <ion-textarea [(ngModel)]="testDriveNotes" rows="3" placeholder="Any special requests..."></ion-textarea>
            </ion-item>
          </ion-list>
        </ion-content>
      </ng-template>
    </ion-modal>

    <ion-toast
      [isOpen]="showToast"
      [message]="toastMessage"
      [duration]="3000"
      [color]="toastColor"
      position="top"
      (didDismiss)="showToast = false"
    ></ion-toast>
  `,
  styles: [`
    .contact-dealer {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .contact-header {
      background: linear-gradient(135deg, #667eea, #764ba2);
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .contact-header ion-icon {
      font-size: 28px;
      color: white;
    }

    .contact-header h3 {
      margin: 0;
      font-size: 20px;
      color: white;
      font-weight: 600;
    }

    .contact-body {
      padding: 24px;
    }

    ion-input, ion-textarea {
      --background: #f8f9fa;
      --border-radius: 10px;
      margin-bottom: 16px;
    }

    .dealer-contact {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e8ecf1;
    }

    .dealer-contact h4 {
      margin: 0 0 16px 0;
      font-size: 14px;
      color: #7f8c8d;
      font-weight: 600;
      text-transform: uppercase;
    }

    .contact-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 8px;
      margin-bottom: 8px;
      text-decoration: none;
      color: #2c3e50;
      font-weight: 500;
    }

    .contact-link ion-icon {
      color: #667eea;
      font-size: 20px;
    }

    .form-content {
      --background: white;
    }

    ion-list {
      background: transparent;
      padding: 24px;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonCard,
    IonCardContent,
    IonInput,
    IonTextarea,
    IonButton,
    IonIcon,
    IonDatetime,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonToast
  ]
})
export class ContactDealerComponent {
  @Input() car: Car | null = null;
  @Input() carName: string = '';
  
  name = '';
  email = '';
  phone = '';
  message = '';
  showTestDriveModal = false;
  testDriveName = '';
  testDrivePhone = '';
  testDriveEmail = '';
  testDriveDate = '';
  testDriveTime = '';
  testDriveNotes = '';
  showToast = false;
  toastMessage = '';
  toastColor = 'success';

  dealerPhone = '(555) 123-4567';
  dealerEmail = 'sales@carshop.com';

  private firestoreService = inject(FirestoreService);

  constructor() {
    addIcons({ mailOutline, callOutline, calendarOutline, sendOutline, closeOutline, checkmarkOutline });
  }

  sendMessage() {
    console.log('Sending message:', {
      name: this.name,
      email: this.email,
      phone: this.phone,
      message: this.message,
      car: this.carName
    });

    this.toastMessage = 'Message sent successfully!';
    this.toastColor = 'success';
    this.showToast = true;
    
    // Reset form
    this.name = '';
    this.email = '';
    this.phone = '';
    this.message = '';
  }

  scheduleTestDrive() {
    console.log('Scheduling test drive:', {
      name: this.testDriveName,
      phone: this.testDrivePhone,
      email: this.testDriveEmail,
      date: this.testDriveDate,
      time: this.testDriveTime,
      notes: this.testDriveNotes,
      car: this.carName
    });

    this.toastMessage = 'Test drive scheduled! We will contact you soon.';
    this.toastColor = 'success';
    this.showToast = true;
    this.showTestDriveModal = false;
    
    // Reset form
    this.testDriveName = '';
    this.testDrivePhone = '';
    this.testDriveEmail = '';
    this.testDriveDate = '';
    this.testDriveTime = '';
    this.testDriveNotes = '';
  }
}
