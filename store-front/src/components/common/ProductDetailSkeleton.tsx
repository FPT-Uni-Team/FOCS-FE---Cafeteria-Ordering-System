"use client";

import React from "react";

const ProductDetailSkeleton = () => {
  return (
    <div className="p-2 space-y-4 animate-pulse">
      <div className="w-full h-60 bg-gray-200 rounded-xl" />
      <div className="w-2/3 h-5 bg-gray-200 rounded-md" />
      <div className="w-1/3 h-5 bg-gray-200 rounded-md" />
      <div className="w-full h-4 bg-gray-200 rounded-md" />
      <div className="w-5/6 h-4 bg-gray-200 rounded-md" />
      <div className="w-4/6 h-4 bg-gray-200 rounded-md" />
      <div className="w-2/4 h-5 bg-gray-200 rounded-md mt-6" />
      <div className="flex gap-2">
        <div className="w-20 h-10 bg-gray-200 rounded-md" />
        <div className="w-20 h-10 bg-gray-200 rounded-md" />
        <div className="w-20 h-10 bg-gray-200 rounded-md" />
      </div>
      <div className="w-full h-12 bg-gray-300 rounded-lg mt-6" />
    </div>
  );
};

export default ProductDetailSkeleton;
