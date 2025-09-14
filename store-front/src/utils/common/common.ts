import { usePathname } from "next/navigation";

export function useCleanPath() {
  const pathname = usePathname();
  const cleaned = pathname.replace(/^\/(en|vi)/, "");
  return cleaned === "" ? "/" : cleaned;
}

export const makeHref = (path: string) => {
  if (typeof window === "undefined") {
    return `/${path}`;
  }
  const tableId = sessionStorage.getItem("tableStoreId");
  const storeId = sessionStorage.getItem("storeFrontId");

  if (storeId && tableId) {
    return `/${storeId}/${tableId}/${path}`;
  }
  return `/${path}`;
};
