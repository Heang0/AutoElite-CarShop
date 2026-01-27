import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-account',
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-title>Account</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content [fullscreen]="true">
      <div class="account-container">
        <div class="profile-section">
          <div class="profile-avatar">
            <ion-icon name="person-circle-outline" size="large"></ion-icon>
          </div>
          <h2>Welcome, User!</h2>
          <p>Manage your profile and preferences</p>
        </div>
        
        <div class="settings-list">
          <ion-item>
            <ion-icon name="person-outline" slot="start"></ion-icon>
            <ion-label>Profile Settings</ion-label>
            <ion-icon name="chevron-forward-outline" slot="end"></ion-icon>
          </ion-item>
          
          <ion-item>
            <ion-icon name="key-outline" slot="start"></ion-icon>
            <ion-label>Security</ion-label>
            <ion-icon name="chevron-forward-outline" slot="end"></ion-icon>
          </ion-item>
          
          <ion-item>
            <ion-icon name="notifications-outline" slot="start"></ion-icon>
            <ion-label>Notifications</ion-label>
            <ion-icon name="chevron-forward-outline" slot="end"></ion-icon>
          </ion-item>
          
          <ion-item>
            <ion-icon name="card-outline" slot="start"></ion-icon>
            <ion-label>Payment Methods</ion-label>
            <ion-icon name="chevron-forward-outline" slot="end"></ion-icon>
          </ion-item>
          
          <ion-item>
            <ion-icon name="help-circle-outline" slot="start"></ion-icon>
            <ion-label>Help & Support</ion-label>
            <ion-icon name="chevron-forward-outline" slot="end"></ion-icon>
          </ion-item>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./account.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class AccountPage {}