// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// ⚠️ SECURITY NOTICE:
// - Firebase API keys are safe to expose (they're not secrets)
// - Firebase security is handled through Firebase Console security rules
// - NEVER expose admin passwords, API secrets, or private keys in client code
// - For production, use environment.local.ts (gitignored) or a backend service

export const environment = {
  production: false,
  apiBaseUrl: 'http://127.0.0.1:4000/api',
  firebase: {
    // Firebase configuration
    // Note: These values are public and used to identify your Firebase project
    // Security is controlled via Firebase Console -> Rules, not by hiding these values
    apiKey: "AIzaSyB56-_qhArqsBRNv58zM286Gnf-dOPMnNE",
    authDomain: "ionic-car-app.firebaseapp.com",
    projectId: "ionic-car-app",
    storageBucket: "ionic-car-app.firebasestorage.app",
    messagingSenderId: "32087788698",
    appId: "1:32087788698:web:270df2cec09f6dcfa56323",
    measurementId: "G-D56HWJJLX5"
  },
  // ⚠️ WARNING: Admin credentials should NEVER be in client-side code for production!
  // This is for development/demo purposes only.
  // For production, implement proper backend authentication with Firebase Admin SDK.
  adminEmail: 'hakchhaiheang0@gmail.com',
  adminPassword: 'CHANGE_THIS_IN_PRODUCTION', // Placeholder - use environment.local.ts for real value
  cloudinary: {
    cloudName: 'dpaq3ova2',
    uploadPreset: 'car-app-preset'
  }
};

/*
 * SECURITY BEST PRACTICES:
 * ------------------------
 * 1. Firebase API Keys: Safe to expose - they identify your project, not authenticate
 * 2. Security Rules: Set up proper Firestore/Storage rules in Firebase Console
 * 3. Admin Auth: Use Firebase Admin SDK on backend, never client-side passwords
 * 4. API Secrets: Store in backend environment variables, never in client code
 * 5. .env files: Use for local development, never commit sensitive data
 * 
 * For production deployment:
 * - Copy environment.local.ts.example to environment.local.ts
 * - Fill in real admin credentials
 * - Add environment.local.ts to .gitignore (already done)
 * - Configure Firebase Security Rules in Firebase Console
 */
