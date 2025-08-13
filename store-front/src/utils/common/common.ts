import { usePathname } from "next/navigation";

export function useCleanPath() {
  const pathname = usePathname();
  const cleaned = pathname.replace(/^\/(en|vi)/, "");
  return cleaned === "" ? "/" : cleaned;
}

export const makeHref = (path: string) => {
  const tableId = localStorage.getItem("tableStoreId");
  const storeId = localStorage.getItem("storeFrontId");

  if (storeId && tableId) {
    return `/${storeId}/${tableId}/${path}`;
  }
  return `/${path}`;
};
