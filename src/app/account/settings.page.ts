import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonToggle,
  IonInput,
  IonToast
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, lockClosedOutline, notificationsOutline, shieldOutline } from 'ionicons/icons';
import { FirestoreService } from '../services/firestore.service';
import { NotificationService } from '../services/notification.service';

interface SettingsState {
  notifications: {
    push: boolean;
    email: boolean;
    marketing: boolean;
  };
  privacy: {
    shareProfile: boolean;
    shareUsage: boolean;
  };
}

@Component({
  selector: 'app-settings',
  template: `
    <ion-header class="settings-header">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="goBack()">
            <ion-icon slot="icon-only" name="arrow-back-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="settings-content">
      <div class="settings-shell">
        <div class="settings-card">
          <div class="section-title">
            <ion-icon name="notifications-outline"></ion-icon>
            <h3>Notifications</h3>
          </div>
          <ion-list lines="none">
            <ion-item>
              <ion-label>Push notifications</ion-label>
              <ion-toggle [(ngModel)]="settings.notifications.push" (ionChange)="togglePushNotifications()"></ion-toggle>
            </ion-item>
            <ion-item>
              <ion-label>Email updates</ion-label>
              <ion-toggle [(ngModel)]="settings.notifications.email" (ionChange)="saveSettings()"></ion-toggle>
            </ion-item>
            <ion-item>
              <ion-label>Marketing offers</ion-label>
              <ion-toggle [(ngModel)]="settings.notifications.marketing" (ionChange)="saveSettings()"></ion-toggle>
            </ion-item>
          </ion-list>
        </div>

        <div class="settings-card">
          <div class="section-title">
            <ion-icon name="shield-outline"></ion-icon>
            <h3>Privacy</h3>
          </div>
          <ion-list lines="none">
            <ion-item>
              <ion-label>Share profile with dealers</ion-label>
              <ion-toggle [(ngModel)]="settings.privacy.shareProfile" (ionChange)="saveSettings()"></ion-toggle>
            </ion-item>
            <ion-item>
              <ion-label>Share usage analytics</ion-label>
              <ion-toggle [(ngModel)]="settings.privacy.shareUsage" (ionChange)="saveSettings()"></ion-toggle>
            </ion-item>
          </ion-list>
        </div>

        <div class="settings-card">
          <div class="section-title">
            <ion-icon name="lock-closed-outline"></ion-icon>
            <h3>Change Password</h3>
          </div>
          <div class="password-form">
            <ion-input
              label="Current password"
              labelPlacement="stacked"
              type="password"
              [(ngModel)]="currentPassword"
              placeholder="Enter current password">
            </ion-input>
            <ion-input
              label="New password"
              labelPlacement="stacked"
              type="password"
              [(ngModel)]="newPassword"
              placeholder="Enter new password">
            </ion-input>
            <ion-input
              label="Confirm new password"
              labelPlacement="stacked"
              type="password"
              [(ngModel)]="confirmPassword"
              placeholder="Re-enter new password">
            </ion-input>
            <ion-button expand="block" (click)="changePassword()">Update Password</ion-button>
          </div>
        </div>
      </div>
    </ion-content>

    <ion-toast
      [isOpen]="showToast"
      [message]="toastMessage"
      [duration]="3000"
      [color]="toastColor"
      position="top"
      (didDismiss)="showToast = false">
    </ion-toast>
  `,
  styleUrls: ['settings.page.scss'],
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
    IonList,
    IonItem,
    IonLabel,
    IonToggle,
    IonInput,
    IonToast
  ]
})
export class SettingsPage implements OnInit {
  settings: SettingsState = {
    notifications: {
      push: false,
      email: true,
      marketing: false
    },
    privacy: {
      shareProfile: true,
      shareUsage: false
    }
  };

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  showToast = false;
  toastMessage = '';
  toastColor = 'success';

  private firestoreService = inject(FirestoreService);
  private notificationService = inject(NotificationService);

  constructor() {
    addIcons({ arrowBackOutline, lockClosedOutline, notificationsOutline, shieldOutline });
  }

  ngOnInit() {
    const user = this.firestoreService.getCurrentUser();
    if (user?.uid) {
      this.firestoreService.getUserSettings(user.uid).then((settings) => {
        const notificationSettings = settings?.['notifications'] as Record<string, boolean> | undefined;
        const privacySettings = settings?.['privacy'] as Record<string, boolean> | undefined;
        this.settings = {
          notifications: {
            push: notificationSettings?.['push'] ?? false,
            email: notificationSettings?.['email'] ?? true,
            marketing: notificationSettings?.['marketing'] ?? false
          },
          privacy: {
            shareProfile: privacySettings?.['shareProfile'] ?? true,
            shareUsage: privacySettings?.['shareUsage'] ?? false
          }
        };
      });
    }
  }

  goBack() {
    window.history.back();
  }

  async togglePushNotifications() {
    if (this.settings.notifications.push) {
      try {
        await this.notificationService.enablePushNotifications();
      } catch (error: any) {
        this.settings.notifications.push = false;
        this.showToastMessage(error?.message || 'Unable to enable push notifications', 'danger');
        return;
      }
    }
    this.saveSettings();
  }

  async saveSettings() {
    const user = this.firestoreService.getCurrentUser();
    if (!user?.uid) {
      this.showToastMessage('Please sign in to save settings', 'danger');
      return;
    }
    await this.firestoreService.updateUserSettings(user.uid, this.settings);
    this.showToastMessage('Settings updated', 'success');
  }

  async changePassword() {
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.showToastMessage('Fill in all password fields', 'danger');
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.showToastMessage('Passwords do not match', 'danger');
      return;
    }
    try {
      await this.firestoreService.updatePassword(this.currentPassword, this.newPassword);
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
      this.showToastMessage('Password updated', 'success');
    } catch (error: any) {
      this.showToastMessage(error?.message || 'Unable to update password', 'danger');
    }
  }

  private showToastMessage(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }
}
