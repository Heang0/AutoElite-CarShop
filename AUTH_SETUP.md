# 🔐 Firebase Authentication Setup for Admin Panel

## Overview
The admin panel now uses **Firebase Authentication** with email + password for secure login.

---

## 🚀 Quick Setup

### Step 1: Enable Email/Password Authentication in Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication** → **Sign-in method**
4. Click **Email/Password**
5. Toggle **Enable** → Click **Save**

### Step 2: Create Admin User

1. Firebase Console → **Authentication** → **Users**
2. Click **Add user**
3. Enter:
   - **Email:** `admin@yourapp.com` (or your preferred email)
   - **Password:** `your-secure-password`
4. Click **Add user**

### Step 3: Update Environment Config

**Option A: Hardcode in `environment.ts` (for development)**

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  firebase: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT_ID.appspot.com',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID',
    measurementId: 'YOUR_MEASUREMENT_ID'
  },
  adminEmail: 'admin@yourapp.com',      // ← Your admin email
  adminPassword: 'your-password'         // ← Your admin password
};
```

**Option B: Use `.env` file (recommended)**

```bash
# .env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
# ... other firebase config

ADMIN_EMAIL=admin@yourapp.com
ADMIN_PASSWORD=your-secure-password
```

### Step 4: Enable Firestore

1. Firebase Console → **Firestore Database**
2. Click **Create database**
3. Start in **test mode** (for development)
4. Choose location

### Step 5: Set Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cars/{carId} {
      // Anyone can read
      allow read: if true;
      // Only authenticated users can write
      allow create, update, delete: if request.auth != null;
    }
  }
}
```

---

## 🔑 Login to Admin Panel

1. **Run the app:**
   ```bash
   npm start
   ```

2. **Navigate to admin:**
   ```
   http://localhost:4200/admin
   ```

3. **Enter credentials:**
   - Email: `admin@yourapp.com`
   - Password: `your-secure-password`

4. **Start managing cars!** 🎉

---

## 📊 How It Works

### Authentication Flow
```
1. Admin enters email + password
2. Firebase Authentication verifies credentials
3. On success: Firebase returns user token
4. App stores session automatically
5. Admin can access protected features
6. On logout: Firebase clears session
```

### Security Features
- ✅ Password hashing (handled by Firebase)
- ✅ Session management (Firebase Auth)
- ✅ Token-based authentication
- ✅ Automatic token refresh
- ✅ Secure logout

---

## 🛡️ Security Best Practices

### For Development (Homework)
- Use simple email/password in `environment.ts`
- Test mode Firestore rules are OK

### For Production
1. **Never hardcode credentials in code**
   - Use environment variables
   - Use Firebase Admin SDK for server-side operations

2. **Stricter Firestore Rules:**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /cars/{carId} {
         allow read: if true;
         allow write: if request.auth != null 
                        && request.auth.token.email == 'admin@yourapp.com';
       }
     }
   }
   ```

3. **Use Firebase Custom Claims** for admin roles:
   ```javascript
   // Set admin claim (server-side)
   admin.auth().setCustomUserClaims(uid, { admin: true });
   ```

4. **Enable additional security:**
   - Email verification
   - Multi-factor authentication (MFA)
   - Password strength requirements

---

## 🔄 Managing Admin Users

### Add New Admin
1. Firebase Console → Authentication → Users
2. Click **Add user**
3. Enter email + password
4. Share credentials securely

### Change Password
1. Firebase Console → Authentication → Users
2. Find the user
3. Click **⋮** (more) → **Reset password**
4. Enter new password

### Delete Admin
1. Firebase Console → Authentication → Users
2. Find the user
3. Click **⋮** (more) → **Delete**

---

## 📝 Login Credentials Template

Copy this for your reference:

```
┌─────────────────────────────────────┐
│  ADMIN LOGIN CREDENTIALS            │
├─────────────────────────────────────┤
│  Email:    admin@yourapp.com        │
│  Password: your-secure-password     │
│                                     │
│  ⚠️ KEEP THIS SECURE!               │
│  Don't commit to Git!               │
└─────────────────────────────────────┘
```

---

## 🆘 Troubleshooting

### "No account found with this email"
→ Create user in Firebase Console → Authentication → Users

### "Incorrect password"
→ Reset password in Firebase Console or check your input

### "Too many failed attempts"
→ Wait a few minutes or enable the account in Firebase Console

### Admin panel shows login screen even after login
→ Check Firebase Console → Authentication is enabled
→ Verify email/password are correct

### Can't add/edit cars after login
→ Check Firestore rules allow authenticated writes
→ Verify Firestore is enabled in your project

---

## 📚 File Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── admin.page.ts       # Login logic + car management
│   │   ├── admin.page.html     # Login form + admin UI
│   │   └── admin.page.scss     # Styling
│   └── services/
│       └── firestore.service.ts  # Firebase Auth + Firestore
└── environments/
    └── environment.ts          # Config (update credentials here)
```

---

## ✅ Checklist

- [ ] Enable Email/Password in Firebase Authentication
- [ ] Create admin user in Firebase Console
- [ ] Update `environment.ts` with admin credentials
- [ ] Enable Firestore Database
- [ ] Set Firestore security rules
- [ ] Test login at `/admin`
- [ ] Add a test car
- [ ] Verify car appears in home page

---

## 🎯 What's Different from Before?

| Before | Now |
|--------|-----|
| Simple password only | Email + Password |
| Password in code | Firebase Authentication |
| Session in sessionStorage | Firebase Auth session |
| No user management | Full user management in Firebase |
| Less secure | More secure (Firebase handles auth) |

---

Ready to go! 🚀

Login at: `http://localhost:4200/admin`
