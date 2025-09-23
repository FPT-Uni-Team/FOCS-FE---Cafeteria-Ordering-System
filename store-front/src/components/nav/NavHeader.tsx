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
import orderService from "@/services/orderService";
import { usePathname } from "next/navigation";

export default function NavHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("nav");
  const [showNotifications, setShowNotifications] = useState(false);
  const [address, setAddress] = useState<{
    name: string;
    address: string;
  } | null>(null);
  const dispatch = useAppDispatch();
  const { searchGlobalData } = useAppSelector((state) => state.common);
  const { list: notifications } = useAppSelector((state) => state.notification);

  const parts = pathname.split("/").filter(Boolean);
  const storeId = parts[1] || "";

  useEffect(() => {
    const fetchStoreSetting = async () => {
      try {
        const res = await orderService.getDetailStoreSetting(storeId);
        setAddress(res.data);
      } catch (error) {
        console.error(error);
      } finally {
      }
    };
    fetchStoreSetting();
  }, [storeId]);

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
        <h1 className="text-sm font-bold">{(address?.name as string) || ""}</h1>
        <p className="text-xs flex items-center gap-1">
          <CiLocationOn className="text-lg" />
          {(address?.address as string) || ""}
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
