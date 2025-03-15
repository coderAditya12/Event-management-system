// firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyD_XWlb5pkYh669K5DNiXfaVcQ0NtxHT6c",
  authDomain: "easy-fest-9338f.firebaseapp.com",
  projectId: "easy-fest-9338f",
  storageBucket: "easy-fest-9338f.appspot.com",
  messagingSenderId: "1019388827510",
  appId: "1:1019388827510:web:d348cfca4d65a005b0cc57",
  measurementId: "G-LCL3VTHRHX",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message", payload);

  // Extract notification details
  const notificationTitle = payload.notification?.title || "Event Update";
  const notificationOptions = {
    body: payload.notification?.body || "Check the latest changes!",
    icon: "/logo.png", // Ensure this path is correct
    data: { url: payload.data?.link || "/" }, // Use the link from your payload
  };

  // Show the notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  const url = event.notification.data?.url || "/"; // Fallback URL
  event.waitUntil(clients.openWindow(url));
});