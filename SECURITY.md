# 🔒 Security Guide

## Important Security Information

### Firebase API Keys - SAFE TO EXPOSE ✅
Your Firebase configuration (apiKey, authDomain, projectId, etc.) is **NOT sensitive information**. These values:
- Identify your Firebase project (like a database connection string)
- Are required in client-side code to connect to Firebase
- Cannot be used to bypass Firebase security

**Firebase security is controlled through Security Rules in Firebase Console, NOT by hiding API keys.**

### What IS Sensitive ❌
Never commit these to Git:
- Admin passwords
- API secrets (Stripe, Twilio, etc.)
- Private keys
- Database passwords
- Backend service credentials

## Setup Instructions

### 1. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `ionic-car-app`
3. Go to Project Settings → General → Your apps
4. Copy the Firebase config (already in environment.ts)

### 2. Set Up Security Rules
In Firebase Console:
1. Go to **Firestore Database** → **Rules**
2. Set up proper read/write rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public read for cars, only admin write
    match /cars/{carId} {
      allow read: if true;
      allow write: if false; // Only through Firebase Admin SDK
    }
    
    // Users can manage their own favorites
    match /favorites/{favoriteId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

3. Go to **Storage** → **Rules** (for Cloudinary alternative)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 3. Local Development
For local development with real credentials:

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` with your actual values (this file is gitignored)

3. For admin credentials, use `src/environments/environment.local.ts`:
```bash
cp src/environments/environment.ts src/environments/environment.local.ts
```

Then edit `environment.local.ts` with real admin credentials.

### 4. Production Deployment

**IMPORTANT**: For production apps:

1. **Never use client-side admin authentication**
   - Implement a backend with Firebase Admin SDK
   - Use environment variables on the server
   - Never expose admin passwords in client code

2. **Set up Firebase App Check**
   - Protects your backend resources from abuse
   - See: https://firebase.google.com/docs/app-check

3. **Enable Firebase Security Rules**
   - Test rules in development mode first
   - Deploy strict rules for production

4. **Use Firebase Authentication**
   - Email/Password, Google, Facebook, etc.
   - Never store passwords yourself

## Current Security Status

| Item | Status | Notes |
|------|--------|-------|
| Firebase API Keys | ✅ Safe | Required for client app |
| Firestore Rules | ⚠️ Check | Review in Firebase Console |
| Storage Rules | ⚠️ Check | Review in Firebase Console |
| Admin Auth | ⚠️ Development Only | Move to backend for production |
| Cloudinary | ✅ Safe | Upload preset is public by design |

## Resources

- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase App Check](https://firebase.google.com/docs/app-check)
- [OWASP Mobile Security](https://owasp.org/www-project-mobile-security/)

## Questions?

If you see security warnings from GitHub or other tools:
1. Firebase API keys are safe - you can mark as "false positive"
2. Admin passwords should be moved to backend
3. When in doubt, consult Firebase documentation
