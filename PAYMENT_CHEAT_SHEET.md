# 🎓 PAYMENT Q&A CHEAT SHEET
## For Teacher Questions - Quick Reference

---

## ❓ TEACHER: "What code did you use to make payment work?"

### ✅ YOU SAY:

> "I used **3 main files**:
>
> 1. **`payment.service.ts`** - Makes API calls to generate KHQR
> 2. **`payment.page.ts`** - Displays QR code & checks payment status  
> 3. **Backend API** (Node.js on port 4000) - Connects to Bakong
>
> **Key functions:**
> - `createBakongPayment()` - Generates KHQR code
> - `startBakongPolling()` - Auto-checks if user paid (every 3 seconds)
> - `createOrder()` - Saves order to Firebase Firestore"

---

## ❓ TEACHER: "Show me the code"

### ✅ OPEN: `src/app/payment/payment.page.ts`

**Point to these lines:**

```typescript
// Line ~380 - Generate KHQR
async loadBakongPayment() {
  const payload = {
    amount: this.paymentAmount,
    currency: 'USD',
    billNumber: this.paymentReference,
    purposeOfTransaction: 'Car purchase',
    carId: String(this.car.id),
    userId: user.uid,
    expirationMinutes: 3
  };
  
  const response = await this.paymentService.createBakongPayment(payload);
  this.bakongQrCode = response.qrImageUrl;  // Display QR
  this.startBakongPolling();  // Auto-check status
}

// Line ~450 - Auto-check every 3 seconds
startBakongPolling() {
  this.paymentPollId = setInterval(async () => {
    const status = await this.paymentService.getBakongPaymentStatus(this.paymentId);
    if (status.status === 'paid') {
      this.showToastMessage('Payment successful!', 'success');
      await this.createOrder();  // Save to Firestore
      this.router.navigate(['/payment-success']);
    }
  }, 3000);
}
```

---

## ❓ TEACHER: "How does KHQR work?"

### ✅ YOU SAY:

> "KHQR is Cambodia's QR code payment system. In my app:
>
> 1. **User selects a car** and chooses 'Pay with KHQR'
> 2. **App shows KHQR code** with the car price amount
> 3. **User scans** with their bank app (ABA, ACLEDA, etc.)
> 4. **User confirms** payment in their bank app
> 5. **Money transfers instantly** from user to merchant
> 6. **App shows success** page
>
> It's fast (10 seconds), safe (bank-secured), and works with ALL Cambodian banks!"

---

## ❓ TEACHER: "Is this real payment or demo?"

### ✅ YOU SAY:

> "**KHQR payment is REAL** - it connects to Bakong API through our backend.
>
> When user scans QR with ABA/ACLEDA app and pays, the backend detects it automatically.
>
> **Card payment is DEMO** for presentation (would need Stripe/PayPal for production).
>
> All orders are saved to **Firebase Firestore** database for admin to manage!"

---

## ❓ TEACHER: "What backend did you use?"

### ✅ YOU SAY:

> "Node.js with Express running on **http://localhost:4000**
>
> **3 API endpoints:**
> - `POST /payments/khqr` - Generate KHQR code
> - `GET /payments/khqr/:paymentId` - Check payment status
> - `POST /payments/khqr/confirm` - Confirm payment
>
> Backend connects to **Bakong API** to generate real KHQR codes."

---

## ❓ TEACHER: "How do you store orders?"

### ✅ YOU SAY:

> "Orders are stored in **Firebase Firestore** database.
>
> When payment is successful, I call `createOrder()` which saves:
> - Car ID & name
> - User ID & email
> - Payment amount ($50,000)
> - Payment method (KHQR/Card)
> - Payment reference number
> - Status (paid/pending)
> - Timestamp
>
> Admin can view all orders in the admin dashboard!"

---

## 📝 KEY FUNCTIONS TO REMEMBER

| Function | What It Does |
|----------|--------------|
| `createBakongPayment()` | Sends request to backend to generate KHQR |
| `loadBakongPayment()` | Gets QR code & displays it |
| `startBakongPolling()` | Checks payment status every 3 seconds |
| `getBakongPaymentStatus()` | Asks backend: "Did user pay?" |
| `createOrder()` | Saves order to Firebase Firestore |

---

## 🎯 30-SECOND EXPLANATION

**If teacher says: "Explain your payment system in 30 seconds"**

> "My app uses **KHQR** - Cambodia's national QR payment system.
>
> When user clicks 'Pay with KHQR', the app:
> 1. Calls backend API to generate a KHQR code
> 2. Displays the QR code for user to scan
> 3. User scans with their bank app (ABA, ACLEDA, etc.)
> 4. App auto-checks payment status every 3 seconds
> 5. When payment detected, saves order to Firebase
> 6. Shows success page and redirects user
>
> It's **fast** (10 seconds), **secure** (bank-protected), and works with **all Cambodian banks**!"

---

## 🔥 QUICK CODE SYNTAX

```typescript
// 1. Generate KHQR
await this.paymentService.createBakongPayment(payload);

// 2. Display QR
this.bakongQrCode = response.qrImageUrl;

// 3. Auto-check every 3 sec
setInterval(() => {
  this.paymentService.getBakongPaymentStatus(this.paymentId);
}, 3000);

// 4. Save to Firestore
await this.firestoreService.addOrder({...});

// 5. Go to success page
this.router.navigate(['/payment-success']);
```

---

## 💡 PRO TIPS

✅ **If code doesn't work during demo:**
> "The backend needs to be running on port 4000. Let me show you the code instead."

✅ **If teacher asks about security:**
> "KHQR is secured by the user's bank. The app only generates the QR code - the actual payment happens in the bank's app with their security (PIN, fingerprint, etc.)."

✅ **If teacher asks about fees:**
> "KHQR transactions are usually free for customers in Cambodia. Merchants pay a small fee to their bank."

✅ **If teacher asks which banks support it:**
> "ALL banks in Cambodia! ABA, ACLEDA, Canadia, Sathapana, LB Bank, BCC Bank, and 20+ more. That's the beauty of KHQR - it's interoperable!"

---

## 📱 BANKS THAT SUPPORT KHQR

```
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│ ABA  │ │ACLEDA│ │Canadia│ │  S   │
│      │ │      │ │       │ │  H   │
│      │ │      │ │       │ │  I   │
│      │ │      │ │       │ │  B   │
└──────┘ └──────┘ └──────┘ └──────┘

┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│  LB  │ │  B   │ │  J   │ │  M   │
│      │ │  C   │ │      │ │  E   │
│      │ │      │ │      │ │  T   │
│      │ │      │ │      │ │  B   │
└──────┘ └──────┘ └──────┘ └──────┘

And 20+ more banks!
```

---

**Good luck tomorrow! You got this! 🚀**
