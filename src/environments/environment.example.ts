function resolveApiBaseUrl() {
  if (typeof window === 'undefined') {
    return 'http://127.0.0.1:4000/api';
  }

  const { protocol, hostname } = window.location;
  const normalizedHost = hostname.toLowerCase();
  const isLocalHost =
    normalizedHost === 'localhost' ||
    normalizedHost === '127.0.0.1' ||
    normalizedHost === '::1';

  if (isLocalHost) {
    return 'http://127.0.0.1:4000/api';
  }

  return `${protocol}//${hostname}:4000/api`;
}

export const environment = {
  production: false,
  apiBaseUrl: resolveApiBaseUrl(),
  firebase: {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID",
    vapidKey: ""
  },
  adminEmail: 'admin@example.com',
  adminPassword: 'change-this-password',
  cloudinary: {
    cloudName: 'your-cloud-name',
    uploadPreset: 'your-upload-preset'
  }
};
