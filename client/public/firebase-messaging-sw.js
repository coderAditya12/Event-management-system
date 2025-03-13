// public/firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
  // Your firebase config
  apiKey: "AIzaSyD_XWlb5pkYh669K5DNiXfaVcQ0NtxHT6c",
  authDomain: "easy-fest-9338f.firebaseapp.com",
  projectId: "easy-fest-9338f",
  storageBucket: "easy-fest-9338f.firebasestorage.app",
  messagingSenderId: "1019388827510",
  appId: "1:1019388827510:web:d348cfca4d65a005b0cc57",
  measurementId: "G-LCL3VTHRHX",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
