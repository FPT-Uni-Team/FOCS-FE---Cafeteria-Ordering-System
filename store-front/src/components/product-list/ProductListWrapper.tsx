"use client";

import { FilterProvider } from "@/context/FilterContext";
import NavBottom from "../nav/NavBottom";
import NavHeaderFilter from "../nav/NavHeaderFilter";
import ProductList from "./ProductList";

export default function ProductListWrapper() {
  return (
    <FilterProvider>
      <NavHeaderFilter />
      <div className="m-4 mt-[120px] mb-[80px]">
        <ProductList />
      </div>
      <NavBottom />
    </FilterProvider>
  );
}
