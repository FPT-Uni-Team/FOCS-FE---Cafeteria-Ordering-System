"use client";

import categoryService from "@/services/categoryService";
import { defaultParams } from "@/types/common";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FiTag } from "react-icons/fi";
import { MdOutlinePriceChange } from "react-icons/md";

type FilterSidebarProps = {
  show: boolean;
  onClose: () => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  selectedPrice: string;
  setSelectedPrice: (price: string) => void;
  onSubmit: () => void;
};

const priceOptions = ["asc", "desc"];

export default function FilterSidebar({
  show,
  onClose,
  selectedCategories,
  setSelectedCategories,
  selectedPrice,
  setSelectedPrice,
  onSubmit,
}: FilterSidebarProps) {
  const t = useTranslations("nav");
  const [categories, setCategories] = useState<
    { id: string; name: string; description: string; is_active: boolean }[]
  >([]);
  const toggleCategory = (cat: string) => {
    setSelectedCategories(
      selectedCategories.includes(cat)
        ? selectedCategories.filter((c) => c !== cat)
        : [...selectedCategories, cat]
    );
  };

  useEffect(() => {
    categoryService
      .getListCategories(defaultParams(1000, 1))
      .then((res) => setCategories(res.data.items));
  }, []);
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={show ? { x: 0 } : { x: "100%" }}
      exit={{ x: "100%" }}
      transition={{ type: "tween", duration: 0.3 }}
      className="fixed top-0 right-0 bottom-0 left-20 bg-white text-black shadow-lg p-4 flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-1">
            {t("filter")}
          </h2>
          <button onClick={onClose} className="text-gray-600">
            <AiOutlineClose />
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-1">
            <FiTag />
            {t("category_filter")}
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-sm border ${
                  selectedCategories.includes(cat.id)
                    ? "bg-green-800 text-white border-green-800"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-1">
            <MdOutlinePriceChange />
            {t("price_sort")}
          </h3>
          <div className="space-y-2">
            {priceOptions.map((opt) => (
              <label key={opt} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="price"
                  value={opt}
                  checked={selectedPrice === opt}
                  onChange={() => setSelectedPrice(opt)}
                />
                {opt === "asc"
                  ? t("price_low_to_high")
                  : t("price_high_to_low")}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button
          onClick={onSubmit}
          className="w-full bg-green-800 text-white py-2 rounded-lg font-semibold"
        >
          {t("apply_filter")}
        </button>
      </div>
    </motion.div>
  );
}
