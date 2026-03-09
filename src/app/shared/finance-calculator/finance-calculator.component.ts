import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonInput, IonRange, IonLabel, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calculatorOutline, cashOutline, timeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-finance-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, IonInput, IonRange, IonLabel, IonIcon, IonButton],
  template: `
    <div class="finance-calculator">
      <div class="calculator-header">
        <ion-icon name="calculator-outline"></ion-icon>
        <h3>Finance Calculator</h3>
      </div>
      <div class="calculator-body">
        <div class="input-group">
          <div class="input-label">
            <ion-icon name="cash-outline"></ion-icon>
            <label>Vehicle Price ($)</label>
          </div>
          <ion-input type="number" [(ngModel)]="vehiclePrice" (ngModelChange)="calculatePayment()"></ion-input>
        </div>
        <div class="input-group">
          <div class="input-label">
            <ion-icon name="cash-outline"></ion-icon>
            <label>Down Payment ($)</label>
          </div>
          <ion-input type="number" [(ngModel)]="downPayment" (ngModelChange)="calculatePayment()"></ion-input>
        </div>
        <div class="input-group">
          <div class="input-label">
            <ion-icon name="time-outline"></ion-icon>
            <label>Interest Rate (%)</label>
          </div>
          <div class="range-with-value">
            <ion-range [min]="0" [max]="20" [step]="0.1" [(ngModel)]="interestRate" (ngModelChange)="calculatePayment()"></ion-range>
            <span class="range-value">{{ interestRate }}%</span>
          </div>
        </div>
        <div class="input-group">
          <div class="input-label">
            <ion-icon name="time-outline"></ion-icon>
            <label>Loan Term (Months)</label>
          </div>
          <div class="range-with-value">
            <ion-range [min]="12" [max]="84" [step]="12" [(ngModel)]="loanTerm" (ngModelChange)="calculatePayment()"></ion-range>
            <span class="range-value">{{ loanTerm }} mo</span>
          </div>
        </div>
        <div class="payment-result">
          <div class="result-label">Estimated Monthly Payment</div>
          <div class="result-amount">${{ monthlyPayment | number:'1.2-2' }}</div>
          <div class="result-details">
            <span>Total Interest: ${{ totalInterest | number:'1.2-2' }}</span>
            <span>Total Cost: ${{ totalCost | number:'1.2-2' }}</span>
          </div>
        </div>
        <ion-button expand="block" (click)="applyForFinancing()" class="apply-btn">Apply for Financing</ion-button>
      </div>
    </div>
  `,
  styles: [`
    .finance-calculator{background:#fff;border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,0.08);overflow:hidden}
    .calculator-header{background:linear-gradient(135deg,#667eea,#764ba2);padding:20px;display:flex;align-items:center;gap:12px}
    .calculator-header ion-icon{font-size:28px;color:#fff}
    .calculator-header h3{margin:0;font-size:20px;color:#fff;font-weight:600}
    .calculator-body{padding:24px}
    .input-group{margin-bottom:24px}
    .input-label{display:flex;align-items:center;gap:8px;margin-bottom:8px}
    .input-label ion-icon{color:#667eea;font-size:18px}
    .input-label label{font-size:14px;font-weight:600;color:#2c3e50}
    ion-input{--background:#f8f9fa;--border-radius:10px;--padding-start:16px;font-size:16px}
    .range-with-value{display:flex;align-items:center;gap:12px}
    ion-range{flex:1;--bar-background:#e8ecf1;--bar-background-active:#667eea;--knob-background:#667eea}
    .range-value{min-width:60px;font-size:14px;font-weight:600;color:#667eea;text-align:right}
    .payment-result{background:linear-gradient(135deg,#f8f9fa,#e8ecf1);border-radius:12px;padding:20px;text-align:center;margin:24px 0}
    .result-label{font-size:14px;color:#7f8c8d;margin-bottom:8px}
    .result-amount{font-size:36px;font-weight:700;color:#27ae60;margin-bottom:12px}
    .result-details{display:flex;justify-content:center;gap:24px;font-size:13px;color:#7f8c8d}
    .apply-btn{--border-radius:10px;--background:linear-gradient(135deg,#667eea,#764ba2);font-weight:600}
  `]
})
export class FinanceCalculatorComponent {
  @Input() vehiclePrice: number = 30000;
  downPayment: number = 5000;
  interestRate: number = 5.5;
  loanTerm: number = 60;
  monthlyPayment: number = 0;
  totalInterest: number = 0;
  totalCost: number = 0;

  constructor() {
    addIcons({ calculatorOutline, cashOutline, timeOutline });
    this.calculatePayment();
  }

  calculatePayment() {
    const principal = this.vehiclePrice - this.downPayment;
    const monthlyRate = this.interestRate / 100 / 12;
    if (monthlyRate === 0) {
      this.monthlyPayment = principal / this.loanTerm;
    } else {
      this.monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, this.loanTerm)) / (Math.pow(1 + monthlyRate, this.loanTerm) - 1);
    }
    this.totalCost = this.monthlyPayment * this.loanTerm + this.downPayment;
    this.totalInterest = (this.monthlyPayment * this.loanTerm) - principal;
  }

  applyForFinancing() {
    console.log('Apply for financing');
  }
}
