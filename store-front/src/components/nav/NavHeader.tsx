"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  setSearchGlobalData,
  setSearchTrigger,
} from "@/store/slices/common/commonSlice";
import { useTranslations } from "next-intl";
import { CiLocationOn } from "react-icons/ci";
import { FiSearch } from "react-icons/fi";
import { IoIosNotificationsOutline } from "react-icons/io";
import { useRouter } from "next/navigation";
import { makeHref } from "@/utils/common/common";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import NotificationSidebar from "../common/NotificationSidebar";
import { onMessageListener, requestForToken } from "@/libs/firebase/firebase";
import toast from "react-hot-toast";
import authService from "@/services/authService";

export default function NavHeader() {
  const router = useRouter();
  const t = useTranslations("nav");
  const [showNotifications, setShowNotifications] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [notifications, setNotifications] = useState<any[]>([]);
  const { searchGlobalData, actorId } = useAppSelector((state) => state.common);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initFCM = async () => {
      const deviceToken = await requestForToken();
      if (!deviceToken) return;
      const requestBody = {
        token: deviceToken,
        deviceId: crypto.randomUUID(),
        platform: "web",
        createdAt: new Date().toISOString(),
        lastUsedAt: new Date().toISOString(),
        actorId,
      };
      await authService.storeMobileToken(requestBody);
    };

    initFCM();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onMessageListener().then((payload: any) => {
      const { notification } = payload;
      if (notification?.title) {
        toast.success(notification.title);
        setNotifications((prev) => [
          {
            title: notification.title,
            body: notification.body,
            ts: Date.now(),
          },
          ...prev,
        ]);
      }
    });
  }, []);
  return (
    <section className="fixed top-0 z-4 w-full px-4 py-3 h-[108px] bg-green-900 text-white">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex items-center gap-2 border border-white/30 rounded-lg px-3 py-1 flex-1">
          <FiSearch className="text-white/70" />
          <input
            type="text"
            value={searchGlobalData}
            placeholder={t("search_placeholder")}
            className="flex-1 text-sm outline-none bg-transparent text-white placeholder-white/60"
            onChange={(e) => dispatch(setSearchGlobalData(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                dispatch(setSearchTrigger());
                router.push(makeHref("product-list"));
              }
            }}
          />
        </div>
        <IoIosNotificationsOutline
          size={22}
          onClick={() => setShowNotifications(true)}
        />
      </div>
      <div>
        <h1 className="text-sm font-bold">FOCS</h1>
        <p className="text-xs flex items-center gap-1">
          <CiLocationOn className="text-lg" />
          123 Main Street, City, Country
        </p>
      </div>
      <AnimatePresence>
        {showNotifications && (
          <NotificationSidebar
            show={showNotifications}
            onClose={() => setShowNotifications(false)}
            notifications={notifications}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
