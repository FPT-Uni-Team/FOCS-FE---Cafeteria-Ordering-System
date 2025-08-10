"use client";

import React from "react";

export default function OrderSkeleton() {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 space-y-3 animate-pulse">
      <div className="flex justify-between items-center border-b pb-2">
        <div>
          <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="flex items-center gap-3 py-2 border-b">
        <div className="w-20 h-20 bg-gray-200 rounded-md"></div>
        <div className="flex flex-col flex-grow space-y-2">
          <div className="h-4 bg-gray-200 rounded w-40"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="flex justify-end pt-2 border-t">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  );
}
