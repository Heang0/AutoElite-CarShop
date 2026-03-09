import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface BakongPaymentRequest {
  amount: number;
  currency?: 'USD' | 'KHR';
  billNumber?: string;
  purposeOfTransaction?: string;
  carId?: string;
  userId?: string;
  expirationMinutes?: number;
}

export interface BakongPaymentResponse {
  success: boolean;
  paymentId: string;
  reference: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid';
  qrString: string;
  qrImageUrl: string;
  merchantName?: string;
  expiresAt: number | null;
  paidAt?: number | null;
}

export interface BakongPaymentStatusResponse {
  success: boolean;
  paymentId: string;
  status: 'pending' | 'paid' | 'expired' | 'failed';
  reference: string;
  amount: number;
  currency: string;
  paidAt?: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly apiBase = environment.apiBaseUrl;

  private async requestJson<T>(input: string, init?: RequestInit): Promise<T> {
    let response: Response;

    try {
      response = await fetch(input, init);
    } catch {
      throw new Error('Payment server is offline. Start the backend on port 4000.');
    }

    const rawText = await response.text();
    let payload: any = null;

    try {
      payload = rawText ? JSON.parse(rawText) : null;
    } catch {
      payload = null;
    }

    if (!response.ok) {
      throw new Error(
        payload?.message ||
          payload?.error ||
          `Payment request failed with status ${response.status}.`
      );
    }

    return (payload ?? {}) as T;
  }

  async createBakongPayment(payload: BakongPaymentRequest): Promise<BakongPaymentResponse> {
    return this.requestJson<BakongPaymentResponse>(`${this.apiBase}/payments/khqr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }

  async confirmBakongPayment(
    paymentId: string
  ): Promise<{ success: boolean; status: 'pending' | 'paid' | 'expired' | 'failed'; paidAt?: number | null }> {
    return this.requestJson(`${this.apiBase}/payments/khqr/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId })
    });
  }

  async getBakongPaymentStatus(paymentId: string): Promise<BakongPaymentStatusResponse> {
    return this.requestJson<BakongPaymentStatusResponse>(`${this.apiBase}/payments/khqr/${paymentId}`);
  }
}
