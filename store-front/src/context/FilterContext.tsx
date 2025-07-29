"use client";

import { createContext, useContext, useState } from "react";

type FilterContextType = {
  selectedCategories: string[];
  setSelectedCategories: (v: string[]) => void;
  selectedPrice: string;
  setSelectedPrice: (v: string) => void;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string>("");
  return (
    <FilterContext.Provider
      value={{
        selectedCategories,
        setSelectedCategories,
        selectedPrice,
        setSelectedPrice,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) throw new Error("useFilter must be used within FilterProvider");
  return context;
};
