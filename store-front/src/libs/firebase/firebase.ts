import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  Messaging,
} from "firebase/messaging";
import { getInstallations, getId } from "firebase/installations";

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

export const requestForFID = async () => {
  try {
    const installations = getInstallations(app);
    const fid = await getId(installations);
    return fid;
  } catch (err) {
    console.error("An error occurred while retrieving FID.", err);
    return null;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const onMessageListener = (callback: (payload: any) => void) => {
  const messaging = getMessaging(app);
  return onMessage(messaging, callback);
};
