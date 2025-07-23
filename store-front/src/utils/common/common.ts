import { usePathname } from "next/navigation";

export function useCleanPath() {
  const pathname = usePathname();
  const cleaned = pathname.replace(/^\/(en|vi)/, "");
  return cleaned === "" ? "/" : cleaned;
}
