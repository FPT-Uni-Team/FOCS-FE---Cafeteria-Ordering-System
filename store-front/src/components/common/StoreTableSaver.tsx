"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";
import { parseJwt } from "@/libs/auth/authOptions";
import { useAppDispatch } from "@/hooks/redux";
import { setStoreId, setTableId } from "@/store/slices/common/commonSlice";

export default function StoreTableWatcher() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const parts = pathname.split("/").filter(Boolean);
    const storeId = parts[1] || "";
    const tableId = parts[2] || "";

    if (storeId) {
      sessionStorage.setItem("storeFrontId", storeId);
      dispatch(setStoreId(storeId));
    }

    if (tableId) {
      sessionStorage.setItem("tableStoreId", tableId);
      dispatch(setTableId(tableId));
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
  }, [pathname, dispatch]);

  return null;
}
