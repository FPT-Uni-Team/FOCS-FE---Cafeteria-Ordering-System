"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";
import { parseJwt } from "@/libs/auth/authOptions";

export default function StoreTableWatcher() {
  const pathname = usePathname();
  useEffect(() => {
    const parts = pathname.split("/").filter(Boolean);
    const storeId = parts[1];
    const tableId = parts[2];
    if (storeId) {
      localStorage.setItem("storeFrontId", storeId);
    }
    if (tableId) {
      localStorage.setItem("tableStoreId", tableId);
    }
    const setActorId = async () => {
      const session = await getSession();
      const token = session?.accessToken;

      if (token) {
        const payload = parseJwt(token);
        const actorId = payload?.id;
        if (actorId) {
          localStorage.setItem("actorId", actorId);
          return;
        }
      }

      if (!localStorage.getItem("actorId")) {
        localStorage.setItem("actorId", uuidv4());
      }
    };

    setActorId();
  }, [pathname]);

  return null;
}
