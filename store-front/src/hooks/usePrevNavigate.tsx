"use client";

import { usePathname } from "next/navigation";
import { useAppDispatch } from "./redux";
import { setPrevNavigate } from "@/store/slices/common/commonSlice";

const usePrevNavigate = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const trigger = () => {
    dispatch(setPrevNavigate(pathname));
  };
  return trigger;
};

export default usePrevNavigate;
