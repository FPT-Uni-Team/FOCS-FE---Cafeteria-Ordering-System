import { useTranslations } from "next-intl";
import { CiLocationOn } from "react-icons/ci";
import { FiSearch } from "react-icons/fi";

export default function NavHeader() {
  const t = useTranslations("nav");
  return (
    <section className="fixed top-0 z-2 w-full px-4 py-3 h-[108px] bg-green-800  text-white">
      <div className="mb-4">
        <div className="flex items-center gap-2 border border-white/30 rounded-lg px-3 py-1">
          <FiSearch className="text-white/70" />
          <input
            type="text"
            placeholder={t("search_placeholder")}
            className="flex-1 text-sm outline-none bg-transparent text-white placeholder-white/60"
          />
        </div>
      </div>
      <div>
        <h1 className="text-sm font-bold">FOCS</h1>
        <p className="text-xs flex items-center gap-1">
          <CiLocationOn className="text-lg" />
          123 Main Street, City, Country
        </p>
      </div>
    </section>
  );
}
