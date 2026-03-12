# 💻 SHOW YOUR TEACHER THE CODE
## Exact Code to Show When Asked "How did you make payment work?"

---

## 🎯 STEP 1: Tell Him Which Files

Say this:
> **"I used 4 files for KHQR payment:"**

```
FRONTEND (Angular/Ionic):
1. src/app/services/payment.service.ts    ← API calls
2. src/app/payment/payment.page.ts        ← Display QR & check status

BACKEND (Node.js/Express):
3. backend/src/controllers/payments.controller.js  ← Generate KHQR
4. backend/src/services/bakong.service.js          ← Bakong API integration
```

---

## 🎯 STEP 2: Show BACKEND Code First (Most Important!)

### File 1: Bakong Service - Core Integration

**Open:** `backend/src/services/bakong.service.js`

**Show this function (Line ~40-70):**

```javascript
export function generateMerchantKhqr({
  amount,
  currency,
  billNumber,
  purposeOfTransaction,
  expirationMinutes
}) {
  // Create merchant info with account ID
  const merchantId = env.bakongMerchantId || env.bakongAccountId;
  const acquiringBank = env.bakongAcquiringBank || 'UNKNOWNBANK';

  const merchantInfo = new MerchantInfo(
    env.bakongAccountId,              // Your Bakong account
    env.bakongMerchantName || 'AutoElite',
    env.bakongMerchantCity || 'Phnom Penh',
    merchantId,
    acquiringBank,
    {
      currency: resolveCurrency(currency),
      amount: typeof amount === 'number' ? amount : undefined,
      billNumber,
      purposeOfTransaction,
      expirationTimestamp: Date.now() + minutes * 60 * 1000
    }
  );

  // Generate KHQR using Bakong library
  const response = khqr.generateMerchant(merchantInfo);
  
  return {
    qrString: response.data?.qr,    // QR code data
    md5: response.data?.md5,         // For verification
    expiresAt: optionalData.expirationTimestamp || null
  };
}
```

**Tell teacher:**
> "This uses the `bakong-khqr` library to generate real KHQR codes. It creates merchant info with account ID, amount, and currency, then calls `generateMerchant()` to get the QR code."

---

### File 2: Payment Controller - API Endpoint

**Open:** `backend/src/controllers/payments.controller.js`

**Show this function (Line ~25-65):**

```javascript
export async function createBakongPayment(req, res) {
  try {
    const { amount, currency, billNumber, purposeOfTransaction, carId, userId } = req.body;

    // Validate amount
    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      res.status(400).json({ success: false, message: 'Invalid amount' });
      return;
    }

    const reference = billNumber || `CAR-${Date.now().toString(36).toUpperCase()}`;
    
    // Generate KHQR using service
    const { qrString, md5, expiresAt } = generateMerchantKhqr({
      amount: parsedAmount,
      currency,
      billNumber: reference,
      purposeOfTransaction,
      expirationMinutes: 3
    });

    // Save payment session to database
    const session = await PaymentSession.create({
      reference,
      amount: parsedAmount,
      currency,
      md5,              // For verification later
      qrString,         // QR code data
      status: 'pending',
      carId,
      userId,
      expiresAt
    });

    // Return QR code to frontend
    res.json({
      success: true,
      paymentId: String(session._id),
      reference: session.reference,
      amount: session.amount,
      qrString: session.qrString,
      qrImageUrl: `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(session.qrString)}`,
      status: 'pending',
      expiresAt: session.expiresAt.getTime()
    });
  } catch (error) {
    console.error('[Bakong] Failed to create payment', error);
    res.status(500).json({ success: false, message: 'Failed to create KHQR payment' });
  }
}
```

**Tell teacher:**
> "This is the API endpoint that frontend calls. It validates the amount, generates KHQR using the service, saves payment session to database with 'pending' status, and returns QR code URL to frontend."

---

### File 3: Check Transaction Status (Verification)

**Still in:** `backend/src/services/bakong.service.js`

**Show this function (Line ~75-110):**

```javascript
export async function checkTransactionByMd5(md5) {
  if (!md5) {
    throw new Error('Missing md5 for payment verification');
  }

  // Call Bakong API to check if payment was made
  const response = await fetch(`${env.bakongApiBaseUrl}/v1/check_transaction_by_md5`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.bakongToken}`
    },
    body: JSON.stringify({ md5 })
  });

  const payload = await response.json();
  
  // Check if transaction was successful
  const paid =
    Boolean(payload?.data) ||
    payload?.transactionStatus === 'SUCCESS' ||
    payload?.status === 'SUCCESS';

  return {
    paid,
    raw: payload
  };
}
```

**Tell teacher:**
> "This calls Bakong's API to verify if payment was made. It sends the MD5 hash from the QR code, and Bakong returns the transaction status. If status is 'SUCCESS', payment is confirmed."

---

## 🎯 STEP 3: Show FRONTEND Code

### File 4: Frontend Service - API Calls

**Open:** `src/app/services/payment.service.ts`

**Show this function (Line ~60-70):**

```typescript
async createBakongPayment(payload: BakongPaymentRequest) {
  return this.requestJson<BakongPaymentResponse>(
    `${this.apiBase}/payments/khqr`, 
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }
  );
}
```

**Tell teacher:**
> "This sends POST request to backend at `/payments/khqr` with amount and car info. Backend returns QR code."

---

### File 5: Frontend Payment Page - Display & Verify

**Open:** `src/app/payment/payment.page.ts`

**Show function 1 (Line ~380):**

```typescript
async loadBakongPayment() {
  const payload = {
    amount: this.paymentAmount,        // $50,000
    currency: 'USD',
    billNumber: this.paymentReference,
    purposeOfTransaction: 'Car purchase',
    carId: String(this.car.id),
    userId: user.uid,
    expirationMinutes: 3
  };
  
  const response = await this.paymentService.createBakongPayment(payload);
  this.bakongQrCode = response.qrImageUrl;  // Display QR
  this.paymentId = response.paymentId;      // Save for checking
  this.startBakongPolling();  // Auto-check status
}
```

**Tell teacher:**
> "This prepares payment data and calls backend API. When response comes back, I display the QR code image and start auto-checking status."

---

**Show function 2 (Line ~450):**

```typescript
startBakongPolling() {
  this.paymentPollId = setInterval(async () => {
    const status = await this.paymentService
      .getBakongPaymentStatus(this.paymentId);
    
    if (status.status === 'paid') {
      this.showToastMessage('Payment successful!', 'success');
      await this.createOrder();  // Save to Firebase
      this.router.navigate(['/payment-success']);
      this.stopBakongPolling();
    }
  }, 3000);  // Check every 3 seconds
}
```

**Tell teacher:**
> "This uses `setInterval()` to call backend every 3 seconds to check if user paid. When status is 'paid', it saves order to Firebase and shows success page."

---

## 📝 QUICK CHEAT SHEET - MEMORIZE THIS

| When Teacher Asks... | Open This File | Show This Line |
|---------------------|----------------|----------------|
| "How do you generate QR?" | `bakong.service.js` | `khqr.generateMerchant(merchantInfo)` |
| "How do you check if paid?" | `bakong.service.js` | `checkTransactionByMd5(md5)` |
| "What API endpoint?" | `payments.controller.js` | `createBakongPayment(req, res)` |
| "How does frontend get QR?" | `payment.service.ts` | `createBakongPayment(payload)` |
| "How do you display QR?" | `payment.page.ts` | `this.bakongQrCode = response.qrImageUrl` |
| "How do you check status?" | `payment.page.ts` | `setInterval()` every 3 seconds |

---

## 🗣️ COMPLETE SCRIPT FOR DEMO

**Teacher:** "Show me the code you used for payment."

**You:** (Open files as you speak)

> "Sure! Let me show you the **complete flow**:
>
> **BACKEND (Node.js):**
>
> 1. **`bakong.service.js`** - Uses Bakong library to generate KHQR
>    *(Open this file)*
>    The `generateMerchantKhqr()` function creates merchant info and calls `khqr.generateMerchant()` to get QR code.
>
> 2. **`payments.controller.js`** - API endpoint
>    *(Open this file)*
>    The `createBakongPayment()` function receives amount from frontend, calls the service to generate QR, saves to database, returns QR URL.
>
> 3. **`checkTransactionByMd5()`** - Verifies payment
>    *(Open bakong.service.js again)*
>    This calls Bakong API with MD5 hash to check if transaction was successful.
>
> **FRONTEND (Angular/Ionic):**
>
> 4. **`payment.service.ts`** - Makes API calls
>    *(Open this file)*
>    This sends POST request to backend at `/payments/khqr`.
>
> 5. **`payment.page.ts`** - Displays QR & checks status
>    *(Open this file)*
>    The `loadBakongPayment()` function gets QR code and displays it.
>    Then `startBakongPolling()` checks status every 3 seconds using `setInterval()`.
>    When status is 'paid', it saves order to Firebase Firestore.
>
> That's the complete flow!"

---

## 🔥 IF CODE DOESN'T WORK DURING DEMO

**Say this:**
> "The backend needs Bakong credentials configured to generate real KHQR codes. Let me show you the code instead."

*(Then open the files above and explain)*

---

## 🎯 5 KEY LINES TO REMEMBER

```javascript
// 1. Generate KHQR (backend)
const response = khqr.generateMerchant(merchantInfo);

// 2. Check payment (backend)
const response = await fetch(`${bakongApiBaseUrl}/v1/check_transaction_by_md5`, {
  body: JSON.stringify({ md5 })
});

// 3. Frontend calls backend
await this.paymentService.createBakongPayment(payload);

// 4. Display QR
this.bakongQrCode = response.qrImageUrl;

// 5. Auto-check every 3 sec
setInterval(async () => {
  const status = await this.paymentService.getBakongPaymentStatus(this.paymentId);
  if (status.status === 'paid') {
    await this.createOrder();
  }
}, 3000);
```

**Memorize these 5 lines - they're the core of the payment flow!**

---

## ✅ TEACHER MIGHT ASK THESE FOLLOW-UP QUESTIONS

**Q: "What is `bakong-khqr`?"**
> **A:** "It's a Node.js library that implements KHQR standard for Cambodia. It generates QR codes that work with all Cambodian banks."

**Q: "What is MD5 hash?"**
> **A:** "It's a unique identifier for each QR code. Bakong uses it to track which transaction was paid. I send this MD5 to check payment status."

**Q: "Where do you store payment data?"**
> **A:** "In MongoDB using the PaymentSession model. Each session has reference, amount, md5, status (pending/paid), and timestamps."

**Q: "How does Bakong know payment is complete?"**
> **A:** "When user scans QR with their bank app and confirms payment, Bakong's system records it. Then when I call `check_transaction_by_md5`, Bakong returns the status."

**Q: "What if payment expires?"**
> **A:** "Each QR code expires after 3 minutes. The backend checks if current time is past expiration time and marks status as 'expired'."

---

**Good luck! You got this! 🚀**

Just remember:
1. Open `bakong.service.js` → Show `generateMerchantKhqr()`
2. Open `payments.controller.js` → Show `createBakongPayment()`
3. Open `payment.page.ts` → Show `loadBakongPayment()` and `startBakongPolling()`
4. Explain: Backend generates QR → Frontend displays → User scans → Backend verifies → Frontend saves to Firebase
