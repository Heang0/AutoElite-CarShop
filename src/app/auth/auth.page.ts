import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonIcon, IonInput, IonButton, IonSpinner, IonToast } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, logoGoogle, carOutline } from 'ionicons/icons';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-auth',
  template: `
    <ion-content [fullscreen]="true" class="auth-content">
      <div class="auth-container">
        <!-- Logo/Header -->
        <div class="auth-header">
          <ion-icon name="car-outline" class="logo-icon"></ion-icon>
          <h1>Car Shop</h1>
          <p>Find your dream car today</p>
        </div>

        <!-- Toggle between Login and Register -->
        <div class="auth-toggle">
          <button 
            [class.active]="!isRegisterMode" 
            (click)="isRegisterMode = false">
            Sign In
          </button>
          <button 
            [class.active]="isRegisterMode" 
            (click)="isRegisterMode = true">
            Sign Up
          </button>
        </div>

        <!-- Login Form -->
        <div class="auth-form" *ngIf="!isRegisterMode">
          <h2>Welcome Back</h2>
          
          <ion-input
            type="email"
            placeholder="Email"
            [(ngModel)]="email"
            [disabled]="isLoading">
            <ion-icon slot="start" name="mail-outline"></ion-icon>
          </ion-input>

          <ion-input
            type="password"
            placeholder="Password"
            [(ngModel)]="password"
            [disabled]="isLoading">
            <ion-icon slot="start" name="lock-closed-outline"></ion-icon>
          </ion-input>

          <p *ngIf="errorMessage" class="error-text">{{ errorMessage }}</p>

          <ion-button 
            expand="block" 
            (click)="login()" 
            [disabled]="isLoading || !email || !password"
            class="primary-btn">
            <ion-spinner *ngIf="isLoading" name="crescent" style="margin-right: 8px;"></ion-spinner>
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </ion-button>

          <div class="divider">
            <span>OR</span>
          </div>

          <ion-button 
            expand="block" 
            fill="outline"
            (click)="signInWithGoogle()" 
            [disabled]="isLoading"
            class="google-btn">
            <ion-icon slot="start" name="logo-google"></ion-icon>
            Continue with Google
          </ion-button>
        </div>

        <!-- Register Form -->
        <div class="auth-form" *ngIf="isRegisterMode">
          <h2>Create Account</h2>
          
          <ion-input
            type="email"
            placeholder="Email"
            [(ngModel)]="email"
            [disabled]="isLoading">
            <ion-icon slot="start" name="mail-outline"></ion-icon>
          </ion-input>

          <ion-input
            type="password"
            placeholder="Password"
            [(ngModel)]="password"
            [disabled]="isLoading">
            <ion-icon slot="start" name="lock-closed-outline"></ion-icon>
          </ion-input>

          <ion-input
            type="password"
            placeholder="Confirm Password"
            [(ngModel)]="confirmPassword"
            [disabled]="isLoading">
            <ion-icon slot="start" name="lock-closed-outline"></ion-icon>
          </ion-input>

          <p *ngIf="errorMessage" class="error-text">{{ errorMessage }}</p>

          <ion-button 
            expand="block" 
            (click)="register()" 
            [disabled]="isLoading || !email || !password || password !== confirmPassword"
            class="primary-btn">
            <ion-spinner *ngIf="isLoading" name="crescent" style="margin-right: 8px;"></ion-spinner>
            {{ isLoading ? 'Creating account...' : 'Create Account' }}
          </ion-button>

          <div class="divider">
            <span>OR</span>
          </div>

          <ion-button 
            expand="block" 
            fill="outline"
            (click)="signInWithGoogle()" 
            [disabled]="isLoading"
            class="google-btn">
            <ion-icon slot="start" name="logo-google"></ion-icon>
            Continue with Google
          </ion-button>
        </div>

        <!-- Footer -->
        <p class="auth-footer">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </ion-content>

    <!-- Toast Notification -->
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
    .auth-content {
      --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .auth-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .logo-icon {
      font-size: 64px;
      color: white;
      margin-bottom: 16px;
    }

    .auth-header h1 {
      margin: 0 0 8px 0;
      font-size: 32px;
      color: white;
      font-weight: 700;
    }

    .auth-header p {
      margin: 0;
      font-size: 16px;
      color: rgba(255, 255, 255, 0.8);
    }

    .auth-toggle {
      display: flex;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      padding: 4px;
      margin-bottom: 24px;
      width: 100%;
      max-width: 320px;
    }

    .auth-toggle button {
      flex: 1;
      padding: 12px;
      border: none;
      background: transparent;
      color: white;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      border-radius: 10px;
      transition: all 0.3s ease;
    }

    .auth-toggle button.active {
      background: white;
      color: #667eea;
    }

    .auth-form {
      background: white;
      border-radius: 20px;
      padding: 32px;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .auth-form h2 {
      margin: 0 0 24px 0;
      font-size: 24px;
      color: #2c3e50;
      text-align: center;
    }

    ion-input {
      --background: #f8f9fa;
      --border-radius: 10px;
      margin-bottom: 16px;
      --padding-start: 16px;
      border: 1px solid #e8ecf1;
    }

    ion-input ion-icon {
      color: #667eea;
      font-size: 20px;
    }

    .error-text {
      color: #e74c3c;
      font-size: 14px;
      margin-bottom: 16px;
      text-align: center;
    }

    .primary-btn {
      --border-radius: 10px;
      --background: linear-gradient(135deg, #667eea, #764ba2);
      font-weight: 600;
      margin-top: 8px;
    }

    .google-btn {
      --border-radius: 10px;
      --color: #2c3e50;
      font-weight: 600;
      margin-top: 8px;
    }

    .divider {
      display: flex;
      align-items: center;
      margin: 20px 0;
    }

    .divider::before,
    .divider::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid #e8ecf1;
    }

    .divider span {
      padding: 0 16px;
      color: #7f8c8d;
      font-size: 14px;
    }

    .auth-footer {
      margin-top: 24px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);
      text-align: center;
      max-width: 400px;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonIcon,
    IonInput,
    IonButton,
    IonSpinner,
    IonToast
  ]
})
export class AuthPage {
  email = '';
  password = '';
  confirmPassword = '';
  isRegisterMode = false;
  isLoading = false;
  errorMessage = '';
  showToast = false;
  toastMessage = '';
  toastColor = 'success';

  private firestoreService = inject(FirestoreService);
  private router = inject(Router);

  constructor() {
    addIcons({ mailOutline, lockClosedOutline, logoGoogle, carOutline });
  }

  async login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter email and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      await (this.firestoreService as any).signIn(this.email, this.password);
      this.showToastMessage('Welcome back!', 'success');
      this.router.navigate(['/tabs/home']);
    } catch (error: any) {
      this.errorMessage = error.message;
      this.showToastMessage(error.message, 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  async register() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter email and password';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      await (this.firestoreService as any).signUp(this.email, this.password);
      this.showToastMessage('Account created successfully!', 'success');
      this.router.navigate(['/tabs/home']);
    } catch (error: any) {
      this.errorMessage = error.message;
      this.showToastMessage(error.message, 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  async signInWithGoogle() {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      await (this.firestoreService as any).signInWithGoogle();
      this.showToastMessage('Welcome!', 'success');
      this.router.navigate(['/tabs/home']);
    } catch (error: any) {
      this.errorMessage = error.message;
      this.showToastMessage(error.message, 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  showToastMessage(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }
}
