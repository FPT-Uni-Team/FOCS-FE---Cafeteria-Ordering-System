import React from "react";

export default function MyOrders() {
  return (
    <div className="min-h-screen bg-[#f5eee8] p-4 text-sm font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-[#000]">My Orders</h1>
        <div className="relative">
          <button className="bg-[#c27029] p-2 rounded-full">
            🛒
          </button>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            3
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        <button className="text-[#c27029] border-b-2 border-[#c27029] px-4 py-2 font-medium">
          Current Orders
        </button>
        <button className="text-gray-700 px-4 py-2 font-medium">Past Orders</button>
      </div>

      {/* Order Cards */}
      {[1, 2].map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow p-4 mb-4">
          <div className="flex flex-wrap justify-between text-xs mb-2">
            <span className="text-sm text-gray-700 font-semibold">22/06/2020</span>
            <span className="text-[#c27029] font-semibold">Delivery Processing</span>
          </div>
          <div className="text-xs text-gray-500 mb-4">12:25 PM</div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="flex gap-2 items-center">
              <img src="/images/bowl_1.jpg" alt="Product" className="w-14 h-14 rounded-md object-cover" />
              <div>
                <p className="text-sm font-medium text-gray-800">Product</p>
                <p className="text-xs text-gray-500">$10.00 x 2</p>
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <img src="/images/bowl_2.jpg" alt="Product" className="w-14 h-14 rounded-md object-cover" />
              <div>
                <p className="text-sm font-medium text-gray-800">Product</p>
                <p className="text-xs text-gray-500">$10.00 x 1</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between text-sm">
          <p className="text-sm text-gray-700 font-semibold">Total Items: 3</p>
          <p className="text-sm text-gray-700 font-semibold">Total: $60.00</p>
          </div>
        </div>
      ))}

      <button className="w-full mt-4 bg-[#c27029] hover:bg-[#a95a1a] text-white font-semibold py-3 rounded-xl">
        Proceed
      </button>
    </div>
  );
}
