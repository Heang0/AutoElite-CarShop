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
    apiKey: "AIzaSyB56-_qhArqsBRNv58zM286Gnf-dOPMnNE",
    authDomain: "ionic-car-app.firebaseapp.com",
    projectId: "ionic-car-app",
    storageBucket: "ionic-car-app.firebasestorage.app",
    messagingSenderId: "32087788698",
    appId: "1:32087788698:web:270df2cec09f6dcfa56323",
    measurementId: "G-D56HWJJLX5",
    vapidKey: ""
  },
  adminEmail: 'hakchhaiheang0@gmail.com',
  adminPassword: '150106',
  cloudinary: {
    cloudName: 'dpaq3ova2',
    uploadPreset: 'car-app-preset'
  }
};
