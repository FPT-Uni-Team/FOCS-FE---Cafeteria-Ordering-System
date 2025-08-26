import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  Messaging,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

let messaging: Messaging | null = null;
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  try {
    messaging = getMessaging(app);
  } catch (err) {
    console.error("Firebase messaging init error:", err);
  }
}

export const requestForToken = async () => {
  if (!messaging) {
    console.warn("Messaging is not initialized (probably SSR).");
    return null;
  }
  try {
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });
    if (token) {
      return token;
    } else {
      console.log("No registration token available. Request permission first.");
      return null;
    }
  } catch (err) {
    console.error("An error occurred while retrieving token.", err);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) {
      console.warn("Messaging not initialized (SSR).");
      return;
    }
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
