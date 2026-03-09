/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.5/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyB56-_qhArqsBRNv58zM286Gnf-dOPMnNE',
  authDomain: 'ionic-car-app.firebaseapp.com',
  projectId: 'ionic-car-app',
  storageBucket: 'ionic-car-app.firebasestorage.app',
  messagingSenderId: '32087788698',
  appId: '1:32087788698:web:270df2cec09f6dcfa56323'
});

firebase.messaging();
