import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-account',
  template: `
    <ion-header class="clean-header">
      <ion-toolbar class="header-toolbar">
        <ion-buttons slot="start">
          <ion-button fill="clear" size="large" class="menu-btn" (click)="openMenu()">
            <ion-icon name="menu-outline"></ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-title class="store-name">AutoElite</ion-title>

        <ion-buttons slot="end">
          <ion-button fill="clear" size="large" class="notification-btn" (click)="showNotifications()">
            <ion-icon name="notifications-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <div class="account-container">
        <div class="profile-card">
          <div class="profile-pill">PF</div>
          <div class="profile-avatar">
            <img src="https://chhaiheang.onrender.com/img/pf-pic.png" alt="Hak Chhaiheang" />
          </div>
          <div class="profile-info">
            <h2>Hak Chhaiheang</h2>
            <p>Premium Member</p>
          </div>
        </div>

        <div class="settings-card">
          <ion-item button>
            <ion-icon name="person-outline" slot="start"></ion-icon>
            <ion-label>Profile settings</ion-label>
            <ion-icon name="chevron-forward-outline" slot="end"></ion-icon>
          </ion-item>
          <ion-item button>
            <ion-icon name="shield-checkmark-outline" slot="start"></ion-icon>
            <ion-label>Security</ion-label>
            <ion-icon name="chevron-forward-outline" slot="end"></ion-icon>
          </ion-item>
          <ion-item button>
            <ion-icon name="notifications-outline" slot="start"></ion-icon>
            <ion-label>Notifications</ion-label>
            <ion-icon name="chevron-forward-outline" slot="end"></ion-icon>
          </ion-item>
          <ion-item button>
            <ion-icon name="wallet-outline" slot="start"></ion-icon>
            <ion-label>Preferences</ion-label>
            <ion-icon name="chevron-forward-outline" slot="end"></ion-icon>
          </ion-item>
          <ion-item button>
            <ion-icon name="help-circle-outline" slot="start"></ion-icon>
            <ion-label>Support</ion-label>
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
export class AccountPage {
  openMenu() {
    console.log('Menu button clicked');
    alert('Menu functionality would open here');
  }

  showNotifications() {
    console.log('Notifications button clicked');
    alert('Notifications would show here');
  }
}
