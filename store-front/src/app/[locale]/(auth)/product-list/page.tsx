"use client";
import React from "react";

const categories = [
  "Favorite",
  "Coffee",
  "Milk tea",
  "Tea",
  "Bakery",
  "Pizza",
  "Snacks",
  "Burger",
];

const products = [
  {
    group: "Favorite",
    items: [
      { name: "Pure black", price: "59.000 đ", image: "/img/pure-black.png", badge: "", available: true },
      { name: "Latte", price: "59.000 đ", image: "/img/latte.png", badge: "NEW", available: true },
      { name: "Capuccino", price: "69.000 đ", image: "/img/capuccino.png", badge: "", available: true },
      { name: "Arabica 1kg", price: "69.000 đ", image: "/img/arabica.png", badge: "", available: true },
      { name: "Hawaiian pizza", price: "109.999 đ", image: "/img/hawaiian-pizza.png", badge: "", available: false },
      { name: "Smoky burger", price: "96.000 đ", image: "/img/smoky-burger.png", badge: "", available: true },
      { name: "Robusta 1kg", price: "69.000 đ", image: "/img/robusta.png", badge: "", available: true },
    ],
  },
  {
    group: "Coffee",
    items: [
      { name: "Pure black", price: "59.000 đ", image: "/img/pure-black.png", badge: "", available: true },
      { name: "Latte", price: "59.000 đ", image: "/img/latte.png", badge: "NEW", available: true },
      { name: "Capuccino", price: "69.000 đ", image: "/img/capuccino.png", badge: "", available: true },
      { name: "Arabica 1kg", price: "69.000 đ", image: "/img/arabica.png", badge: "", available: true },
      { name: "Hawaiian pizza", price: "109.999 đ", image: "/img/hawaiian-pizza.png", badge: "", available: false },
      { name: "Robusta 1kg", price: "69.000 đ", image: "/img/robusta.png", badge: "", available: true },
    ],
  },
];

export default function ProductListPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Category list */}
      <div className="w-full md:w-32 bg-gray-100 md:h-screen md:fixed top-0 left-0 overflow-x-auto md:overflow-y-auto">
        <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2 p-2 md:p-4 overflow-x-auto">
          {categories.map((cat, idx) => (
            <button
              key={cat}
              className={`whitespace-nowrap px-3 py-2 text-sm rounded-lg ${
                idx === 0 ? "bg-blue-100 text-blue-600 font-semibold" : "text-gray-500 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product list */}
      <div className="flex-1 md:ml-32 p-4 mt-2 md:mt-0">
        <div className="max-w-md mx-auto">
          {products.map((group) => (
            <div key={group.group} className="mb-6">
              <h2 className="text-base font-semibold mb-3 text-gray-700">{group.group}</h2>
              <div className="flex flex-col space-y-4">
                {group.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center space-x-4 bg-white p-3 rounded-lg shadow-sm border"
                  >
                    <div className="relative w-14 h-14">
                      <img
                        src={item.image}
                        alt={item.name}
                        className={`w-full h-full object-contain rounded ${!item.available ? "opacity-40" : ""}`}
                      />
                      {item.badge && (
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] px-1 rounded-full font-bold">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div
                        className={`text-sm font-medium ${
                          !item.available ? "text-gray-300 line-through" : "text-gray-800"
                        }`}
                      >
                        {item.name}
                      </div>
                      <div
                        className={`text-xs ${
                          !item.available ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {item.price}
                      </div>
                      {!item.available && (
                        <div className="text-[10px] text-gray-400">Not available at this store</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
