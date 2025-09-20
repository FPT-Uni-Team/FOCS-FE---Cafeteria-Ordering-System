"use client";

import { useEffect } from "react";

import authService from "@/services/authService";
import toast from "react-hot-toast";
import {
  onMessageListener,
  requestForFID,
  requestForToken,
} from "@/libs/firebase/firebase";
import { addNotification } from "@/store/slices/notification/notificationSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";

export default function NotificationProvider() {
  const dispatch = useAppDispatch();
  const { actorId } = useAppSelector((state) => state.common);

  useEffect(() => {
    const initFCM = async () => {
      try {
        const deviceToken = await requestForToken();
        const fid = await requestForFID();
        if (!deviceToken) return;
        const requestBody = {
          token: deviceToken,
          deviceId: fid as string,
          platform: "web",
          createdAt: new Date().toISOString(),
          lastUsedAt: new Date().toISOString(),
          actorId,
        };
        console.log("FCM Token:", deviceToken);
        console.log("requestBody:", requestBody);
        await authService.storeMobileToken(requestBody);
      } catch (err) {
        console.error("Init FCM failed", err);
      }
    };

    initFCM();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const unsubscribe = onMessageListener((payload: any) => {
      const { notification } = payload;
      console.log("Message received. ", payload);
      if (notification?.title) {
        toast.success(notification.title);
        dispatch(
          addNotification({
            id: crypto.randomUUID(),
            title: notification.title,
            body: notification.body,
            ts: Date.now(),
            read: false,
          })
        );
      }
    });

    return () => unsubscribe();
  }, [actorId, dispatch]);

  return null;
}
