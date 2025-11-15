// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js');

// 🔹 Replace these values with your Firebase Web App config
firebase.initializeApp({
  apiKey: "AIzaSyCzJNObeXMkJ8QhJwsPE_CAwEwm4l7koos",
  authDomain: "YOUR_PROJECT.firebaseapp.comstudio-2370514225-ff786.firebaseapp.com",
  databaseURL: "https://studio-2370514225-ff786-default-rtdb.firebaseio.com",
  projectId: "studio-2370514225-ff786",
  storageBucket: "studio-2370514225-ff786.firebasestorage.app",
  messagingSenderId: "864476623518",
  appId: "1:864476623518:web:90abbacdcf862da5e2818f"
});

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[Service Worker] Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'Umbrella Alert';
  const notificationOptions = {
    body: payload.notification?.body || 'You left your umbrella behind!',
    icon: '/icon.png' // optional: replace with your app icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
