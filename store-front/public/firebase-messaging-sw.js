importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyB9IGNhRWpcF5z_uG6GFPGVN9KjUXqklts",
  authDomain: "https://accounts.google.com/o/oauth2/auth",
  projectId: "focs-e053a",
  storageBucket: "focs-e053a.firebasestorage.app",
  messagingSenderId: "367204991903",
  appId: "1:367204991903:android:a8b24f073d882bb7f6f3aa",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/firebase-logo.png",
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
