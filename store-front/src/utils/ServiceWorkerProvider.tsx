"use client";

import { useEffect } from "react";

export default function ServiceWorkerProvider() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log(
            "[ServiceWorker] Registered with scope:",
            registration.scope
          );
        })
        .catch((err) => {
          console.error("[ServiceWorker] Registration failed:", err);
        });
    }
  }, []);

  return null;
}
