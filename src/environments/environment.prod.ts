function resolveApiBaseUrl() {
  if (typeof window === 'undefined') {
    return 'https://your-express-api.example.com/api';
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

  if (/^(10|127)\./.test(normalizedHost) || /^192\.168\./.test(normalizedHost) || /^172\.(1[6-9]|2\d|3[0-1])\./.test(normalizedHost)) {
    return `${protocol}//${hostname}:4000/api`;
  }

  return 'https://your-express-api.example.com/api';
}

export const environment = {
  production: true,
  apiBaseUrl: resolveApiBaseUrl(),
  firebase: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT_ID.appspot.com',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID',
    measurementId: 'YOUR_MEASUREMENT_ID',
    vapidKey: 'YOUR_VAPID_KEY'
  },
  adminPassword: 'admin123'
};
