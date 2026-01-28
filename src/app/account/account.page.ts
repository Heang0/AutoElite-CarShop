import { Component } from '@angular/core';
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
  IonNote,
  IonLabel
} from '@ionic/angular/standalone';
import { NotificationItem, NOTIFICATION_ITEMS } from '../data/notifications.data';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
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
    IonNote,
    IonLabel
  ]
})
export class AccountPage {
  isNotificationsOpen: boolean = false;
  notificationItems: NotificationItem[] = NOTIFICATION_ITEMS;
  selectedNotification: NotificationItem | null = null;

  openMenu() {
    console.log('Menu button clicked');
    alert('Menu functionality would open here');
  }

  showNotifications(event?: Event) {
    event?.stopPropagation();
    this.isNotificationsOpen = true;
    if (!this.selectedNotification && this.notificationItems.length) {
      this.selectedNotification = this.notificationItems[0];
    }
  }

  dismissNotifications() {
    this.isNotificationsOpen = false;
  }

  handleNotificationClick(notification: NotificationItem) {
    this.selectedNotification = notification;
  }

  clearNotifications() {
    this.isNotificationsOpen = false;
    this.selectedNotification = null;
  }
}
