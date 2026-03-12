import { Injectable, inject } from '@angular/core';
import { getApps, initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { environment } from '../../environments/environment';
import { FirestoreService, type AppNotification } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private firestoreService = inject(FirestoreService);

  async enablePushNotifications(): Promise<string> {
    if (!('Notification' in window)) {
      throw new Error('Notifications not supported');
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Notification permission denied');
    }

    if (!environment.firebase?.vapidKey) {
      throw new Error('Missing VAPID key');
    }

    await this.registerServiceWorker();

    const app = getApps().length ? getApps()[0] : initializeApp(environment.firebase);
    const messaging = getMessaging(app);
    const token = await getToken(messaging, { vapidKey: environment.firebase.vapidKey });

    if (!token) {
      throw new Error('Unable to obtain push token');
    }

    const user = this.firestoreService.getCurrentUser();
    if (user?.uid) {
      await this.firestoreService.savePushToken(user.uid, token);
    }

    onMessage(messaging, async (payload) => {
      const userId = user?.uid;
      if (!userId) return;
      const title = payload.notification?.title || 'AutoElite Update';
      const body = payload.notification?.body || 'You have a new notification.';
      const route = payload.data?.['route'];
      await this.createInAppNotification({
        userId,
        title,
        body,
        icon: payload.data?.['icon'],
        route,
        read: false,
        type: payload.data?.['type'] || 'push'
      });
    });

    return token;
  }

  async createInAppNotification(notification: Omit<AppNotification, 'id' | 'createdAt'>) {
    return this.firestoreService.addNotification(notification);
  }

  async getNotifications(userId: string): Promise<AppNotification[]> {
    return this.firestoreService.getNotificationsByUserId(userId);
  }

  async markAsRead(notificationId: string) {
    return this.firestoreService.markNotificationRead(notificationId);
  }

  async clearForCurrentUser(): Promise<void> {
    const user = this.firestoreService.getCurrentUser();
    if (!user?.uid) {
      return;
    }
    await this.firestoreService.clearNotificationsByUserId(user.uid);
  }

  async notifyUsers(
    userIds: string[],
    payload: Omit<AppNotification, 'id' | 'createdAt' | 'userId'>
  ): Promise<void> {
    await Promise.all(
      userIds.map((userId) =>
        this.createInAppNotification({
          ...payload,
          userId
        })
      )
    );
  }

  async notifyAllUsers(
    payload: Omit<AppNotification, 'id' | 'createdAt' | 'userId'>
  ): Promise<void> {
    const users = await this.firestoreService.getAllUsers();
    const userIds = users.map((user) => String(user.id)).filter(Boolean);
    if (!userIds.length) {
      return;
    }
    await this.notifyUsers(userIds, payload);
  }

  private async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    }
  }
}
