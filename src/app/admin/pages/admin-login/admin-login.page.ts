import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonIcon, IonInput, IonSpinner, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { lockClosedOutline, mailOutline } from 'ionicons/icons';
import { FirestoreService } from '../../../services/firestore.service';

@Component({
  selector: 'app-admin-login',
  template: `
    <ion-content [fullscreen]="true" class="admin-login-content">
      <div class="login-container">
        <div class="login-card">
          <ion-icon name="lock-closed-outline" class="login-icon"></ion-icon>
          <h2>Admin Access</h2>
          <p>Sign in to continue</p>

          <ion-input
            type="email"
            placeholder="Admin email"
            [(ngModel)]="adminEmail"
            (keyup.enter)="login()"
          >
            <ion-icon slot="start" name="mail-outline"></ion-icon>
          </ion-input>

          <ion-input
            type="password"
            placeholder="Password"
            [(ngModel)]="adminPassword"
            (keyup.enter)="login()"
          >
            <ion-icon slot="start" name="lock-closed-outline"></ion-icon>
          </ion-input>

          <p *ngIf="loginError" class="error-text">{{ loginError }}</p>

          <ion-button expand="block" (click)="login()" [disabled]="isLoggingIn">
            <ion-spinner *ngIf="isLoggingIn" name="crescent" style="margin-right: 8px;"></ion-spinner>
            {{ isLoggingIn ? 'Signing in...' : 'Sign In' }}
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .admin-login-content {
      --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .login-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
    }

    .login-card {
      background: white;
      border-radius: 20px;
      padding: 40px;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      text-align: center;
    }

    .login-icon {
      font-size: 64px;
      color: #667eea;
      margin-bottom: 20px;
    }

    .login-card h2 {
      margin: 0 0 8px 0;
      font-size: 28px;
      color: #2c3e50;
      font-weight: 700;
    }

    .login-card p {
      margin: 0 0 32px 0;
      font-size: 16px;
      color: #7f8c8d;
    }

    ion-input {
      --background: #f8f9fa;
      --border-radius: 10px;
      margin-bottom: 16px;
      --padding-start: 16px;
    }

    ion-input ion-icon {
      color: #667eea;
      font-size: 20px;
    }

    .error-text {
      color: #e74c3c;
      font-size: 14px;
      margin-bottom: 16px;
    }

    ion-button {
      --border-radius: 10px;
      --padding-start: 32px;
      --padding-end: 32px;
      font-weight: 600;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonIcon,
    IonInput,
    IonSpinner,
    IonButton
  ]
})
export class AdminLoginPage implements OnInit {
  adminEmail = '';
  adminPassword = '';
  loginError = '';
  isLoggingIn = false;
  isAuthenticated = false;

  private firestoreService = inject(FirestoreService);
  private router = inject(Router);

  constructor() {
    addIcons({ lockClosedOutline, mailOutline });
  }

  ngOnInit() {
    this.firestoreService.onAuthStateChanged(async (user) => {
      if (user) {
        const isAdmin = await this.firestoreService.isCurrentUserAdmin();
        if (isAdmin) {
          this.isAuthenticated = true;
          this.router.navigate(['/admin/dashboard']);
          return;
        }

        await this.firestoreService.signOut();
      }
    });
  }

  async login() {
    if (!this.adminEmail || !this.adminPassword) {
      this.loginError = 'Please enter both email and password';
      return;
    }

    this.isLoggingIn = true;
    this.loginError = '';

    try {
      await this.firestoreService.signIn(this.adminEmail, this.adminPassword);
      const isAdmin = await this.firestoreService.isCurrentUserAdmin();
      if (!isAdmin) {
        await this.firestoreService.signOut();
        throw new Error('This account is not authorized for admin access');
      }

      this.router.navigate(['/admin/dashboard']);
    } catch (error: any) {
      this.loginError = error.message;
    } finally {
      this.isLoggingIn = false;
    }
  }
}
