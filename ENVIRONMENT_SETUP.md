# 🔐 Environment Setup Guide

## ⚠️ IMPORTANT: This repository uses placeholder credentials for security.

## For Local Development (Your Computer):

### Step 1: Copy Example File
```bash
cp src/environments/environment.example.ts src/environments/environment.local.ts
```

### Step 2: Add Your Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click ⚙️ Settings → Project settings
4. Scroll to "Your apps" section
5. Copy the Firebase config

### Step 3: Update `environment.local.ts`

Open `src/environments/environment.local.ts` and replace:

```typescript
firebase: {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
},
adminEmail: 'your-admin-email@example.com',
adminPassword: 'your-admin-password',
cloudinary: {
  cloudName: 'your-cloudinary-name',
  uploadPreset: 'your-upload-preset'
}
```

### Step 4: Run the App
```bash
npm install
ionic serve
```

---

## 🔒 Security Notes:

- ✅ `environment.local.ts` is in `.gitignore` (safe)
- ✅ `environment.ts` has placeholders (safe for GitHub)
- ✅ `.env` is in `.gitignore` (safe)
- ❌ NEVER commit real credentials to GitHub

---

## For Backend (Node.js):

1. Copy `.env.example` to `.env`
2. Fill in your MongoDB and Bakong credentials
3. `.env` is already in `.gitignore` (safe)

```bash
cp .env.example .env
```

---

## 📁 File Structure:

```
src/environments/
├── environment.ts              ← Placeholders (committed to GitHub)
├── environment.local.ts        ← Your real credentials (git-ignored)
└── environment.example.ts      ← Template for others (committed)
```

---

## ✅ Safe to Commit:

- ✅ `environment.ts` (placeholders)
- ✅ `environment.example.ts` (template)
- ✅ All code files

## ❌ NEVER Commit:

- ❌ `environment.local.ts` (real credentials)
- ❌ `.env` (backend secrets)

---

**Your credentials are now secure!** 🔒
