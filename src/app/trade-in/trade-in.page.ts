import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardContent,
  IonInput, IonSelect, IonSelectOption, IonButton, IonIcon, IonRange, IonToast
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { carOutline, cashOutline, calculatorOutline } from 'ionicons/icons';

@Component({
  selector: 'app-trade-in-estimator',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Trade-In Estimator</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="trade-in-content">
        <div class="header-section">
          <ion-icon name="car-outline"></ion-icon>
          <h2>What's your car worth?</h2>
          <p>Get an instant estimate for your trade-in</p>
        </div>

        <ion-card class="estimator-card">
          <ion-card-content>
            <form #tradeForm="ngForm">
              <ion-input
                label="Year"
                label-placement="stacked"
                type="number"
                [(ngModel)]="year"
                name="year"
                placeholder="2020">
              </ion-input>

              <ion-input
                label="Make"
                label-placement="stacked"
                type="text"
                [(ngModel)]="make"
                name="make"
                placeholder="Toyota">
              </ion-input>

              <ion-input
                label="Model"
                label-placement="stacked"
                type="text"
                [(ngModel)]="model"
                name="model"
                placeholder="Camry">
              </ion-input>

              <ion-input
                label="Mileage"
                label-placement="stacked"
                type="number"
                [(ngModel)]="mileage"
                name="mileage"
                placeholder="50000">
              </ion-input>

              <ion-input
                label="VIN (optional)"
                label-placement="stacked"
                type="text"
                [(ngModel)]="vin"
                name="vin"
                placeholder="17-digit VIN">
              </ion-input>

              <div class="condition-section">
                <label>Vehicle Condition</label>
                <div class="condition-options">
                  <button 
                    type="button"
                    [class.active]="condition === 'excellent'"
                    (click)="condition = 'excellent'">
                    <ion-icon name="star"></ion-icon>
                    Excellent
                  </button>
                  <button 
                    type="button"
                    [class.active]="condition === 'good'"
                    (click)="condition = 'good'">
                    <ion-icon name="star"></ion-icon>
                    Good
                  </button>
                  <button 
                    type="button"
                    [class.active]="condition === 'fair'"
                    (click)="condition = 'fair'">
                    <ion-icon name="star"></ion-icon>
                    Fair
                  </button>
                </div>
              </div>

              <ion-button 
                expand="block" 
                (click)="calculateTradeIn()"
                [disabled]="!year || !make || !model || !mileage"
                class="calculate-btn">
                <ion-icon slot="start" name="calculator-outline"></ion-icon>
                Calculate Trade-In Value
              </ion-button>
            </form>
          </ion-card-content>
        </ion-card>

        <!-- Result -->
        <div *ngIf="tradeInValue > 0" class="result-card">
          <div class="result-header">
            <ion-icon name="cash-outline"></ion-icon>
            <span>Estimated Trade-In Value</span>
          </div>
          <div class="result-amount">\${{ tradeInValue | number:'1.0-0' }}</div>
          <div class="result-range">
            Range: \${{ tradeInValue * 0.9 | number:'1.0-0' }} - \${{ tradeInValue * 1.1 | number:'1.0-0' }}
          </div>
          <ion-button expand="block" (click)="applyTradeIn()">
            Apply with Trade-In
          </ion-button>
          <p class="disclaimer">
            *This is an estimate only. Actual trade-in value may vary based on vehicle inspection.
          </p>
        </div>
      </div>
    </ion-content>

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
    .trade-in-content {
      padding: 20px;
    }

    .header-section {
      text-align: center;
      margin-bottom: 24px;
    }

    .header-section ion-icon {
      font-size: 48px;
      color: #667eea;
      margin-bottom: 12px;
    }

    .header-section h2 {
      margin: 0 0 8px 0;
      font-size: 24px;
      color: #2c3e50;
    }

    .header-section p {
      margin: 0;
      font-size: 15px;
      color: #7f8c8d;
    }

    .estimator-card {
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    ion-input {
      --background: #f8f9fa;
      --border-radius: 10px;
      margin-bottom: 16px;
    }

    .condition-section {
      margin: 24px 0;
    }

    .condition-section label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 12px;
    }

    .condition-options {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }

    .condition-options button {
      padding: 16px 8px;
      border: 2px solid #e8ecf1;
      background: white;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .condition-options button.active {
      border-color: #667eea;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
    }

    .condition-options button ion-icon {
      font-size: 24px;
      color: #f39c12;
    }

    .condition-options button span {
      font-size: 13px;
      font-weight: 600;
      color: #2c3e50;
    }

    .calculate-btn {
      --border-radius: 10px;
      --background: linear-gradient(135deg, #667eea, #764ba2);
      font-weight: 600;
      margin-top: 8px;
    }

    .result-card {
      background: linear-gradient(135deg, #27ae60, #2ecc71);
      border-radius: 16px;
      padding: 32px;
      text-align: center;
      color: white;
      margin-top: 24px;
      box-shadow: 0 8px 24px rgba(39, 174, 96, 0.3);
    }

    .result-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .result-header ion-icon {
      font-size: 28px;
    }

    .result-header span {
      font-size: 16px;
      font-weight: 600;
    }

    .result-amount {
      font-size: 48px;
      font-weight: 700;
      margin-bottom: 12px;
    }

    .result-range {
      font-size: 14px;
      opacity: 0.9;
      margin-bottom: 24px;
    }

    .result-card ion-button {
      --border-radius: 10px;
      --background: white;
      --color: #27ae60;
      font-weight: 600;
    }

    .disclaimer {
      font-size: 11px;
      opacity: 0.8;
      margin: 16px 0 0 0;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonCard,
    IonCardContent,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonIcon,
    IonRange,
    IonToast
  ]
})
export class TradeInEstimatorPage {
  year: number | null = null;
  make = '';
  model = '';
  mileage: number | null = null;
  vin = '';
  condition = 'good';
  tradeInValue = 0;
  showToast = false;
  toastMessage = '';
  toastColor = 'success';

  constructor() {
    addIcons({ carOutline, cashOutline, calculatorOutline });
  }

  calculateTradeIn() {
    // Simple estimation logic (in real app, this would call an API)
    const baseValue = 25000;
    const yearFactor = Math.max(0.5, 1 - (new Date().getFullYear() - (this.year || 0)) * 0.05);
    const mileageFactor = Math.max(0.5, 1 - (this.mileage || 0) / 200000);
    const conditionFactor = this.condition === 'excellent' ? 1.2 : this.condition === 'good' ? 1.0 : 0.8;

    this.tradeInValue = Math.round(baseValue * yearFactor * mileageFactor * conditionFactor);

    this.toastMessage = 'Trade-in value calculated!';
    this.toastColor = 'success';
    this.showToast = true;
  }

  applyTradeIn() {
    this.toastMessage = 'Trade-in application submitted!';
    this.toastColor = 'success';
    this.showToast = true;
  }
}
