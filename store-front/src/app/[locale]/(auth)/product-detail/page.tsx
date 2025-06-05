"use client";
import React, { useState } from "react";

const PRODUCT = {
  name: "Capuccino",
  price: 69000,
  description:
    "Dark, rich espresso lies in wait under a smoothed and stretched layer of thick milk foam. An alchemy of barista artistry and craft.",
  image: "/images/capuccino.png",
  sizes: [
    { label: "Small", price: 0, icon: "/images/small-cup.png" },
    { label: "Large", price: 10000, icon: "/images/large-cup.png" },
  ],
  toppings: [
    { label: "Espresso (1 shot)", price: 10000, icon: "/images/espresso.png" },
  ],
};

export default function ProductDetailPage() {
  const [sizeIndex, setSizeIndex] = useState(0);
  const [selectedToppings, setSelectedToppings] = useState<number[]>([]);
  const [note, setNote] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleToppingChange = (idx: number) => {
    if (selectedToppings.includes(idx)) {
      setSelectedToppings(selectedToppings.filter((i) => i !== idx));
    } else if (selectedToppings.length < 2) {
      setSelectedToppings([...selectedToppings, idx]);
    }
  };

  const sizePrice = PRODUCT.sizes[sizeIndex].price;
  const toppingsPrice = selectedToppings.reduce(
    (sum, idx) => sum + PRODUCT.toppings[idx].price,
    0
  );
  const totalPrice = (PRODUCT.price + sizePrice + toppingsPrice) * quantity;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-4 space-y-5">
        {/* Image */}
        <div className="relative">
          <img
            src={PRODUCT.image}
            alt={PRODUCT.name}
            className="w-full rounded-xl"
          />
          <div className="absolute bottom-2 right-2 bg-black text-white text-xs px-2 py-0.5 rounded-full">
            1/5
          </div>
        </div>

        {/* Info */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">{PRODUCT.name}</h2>
            <span className="text-green-600 text-xl font-bold">
              {PRODUCT.price.toLocaleString()} đ
            </span>
          </div>
          <p className="text-sm text-gray-700">{PRODUCT.description}</p>
        </div>

        {/* Size */}
        <div className="border rounded-lg p-3">
          <h3 className="text-base font-semibold text-gray-800 mb-2">Size</h3>
          <div className="flex flex-col gap-2">
            {PRODUCT.sizes.map((size, idx) => (
              <label
                key={size.label}
                className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer ${
                  sizeIndex === idx ? "border-blue-500 bg-blue-50" : ""
                }`}
              >
                <input
                  type="radio"
                  name="size"
                  checked={sizeIndex === idx}
                  onChange={() => setSizeIndex(idx)}
                />
                <img src={size.icon} alt={size.label} className="w-6 h-6" />
                <span className="flex-1 text-sm text-gray-800 font-medium">
                  {size.label}
                </span>
                <span className="text-sm text-gray-600">
                  +{size.price.toLocaleString()} đ
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Topping */}
        <div className="border rounded-lg p-3">
          <h3 className="text-base font-semibold text-gray-800 mb-2">
            Topping <span className="text-sm text-gray-600">(maximum 2)</span>
          </h3>
          <div className="flex flex-col gap-2">
            {PRODUCT.toppings.map((topping, idx) => {
              const isDisabled =
                !selectedToppings.includes(idx) &&
                selectedToppings.length >= 2;
              return (
                <label
                  key={topping.label}
                  className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer ${
                    selectedToppings.includes(idx)
                      ? "border-blue-500 bg-blue-50"
                      : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedToppings.includes(idx)}
                    onChange={() => handleToppingChange(idx)}
                    disabled={isDisabled}
                    className={`${isDisabled ? "cursor-not-allowed" : ""}`}
                  />
                  <img
                    src={topping.icon}
                    alt={topping.label}
                    className="w-6 h-6"
                  />
                  <span
                    className={`flex-1 text-sm font-medium ${
                      isDisabled ? "text-gray-800 opacity-100" : "text-gray-800"
                    }`}
                  >
                    {topping.label}
                  </span>
                  <span className="text-sm text-gray-600">
                    +{topping.price.toLocaleString()} đ
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Note */}
        <div>
          <textarea
            className="w-full border rounded-lg p-2 text-sm text-gray-800 placeholder:text-gray-600 resize-none"
            maxLength={100}
            rows={3}
            placeholder="Your note to barista"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div className="text-xs text-gray-500 text-right">
            ({note.length}/100)
          </div>
        </div>

        {/* Quantity + Add to cart */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-full bg-gray-200 text-gray-800 text-lg flex items-center justify-center"
            >
              –
            </button>
            <span className="w-6 text-center text-gray-800">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-full bg-gray-200 text-gray-800 text-lg flex items-center justify-center"
            >
              +
            </button>
          </div>
          <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-full font-semibold text-sm transition">
            Add to cart - {totalPrice.toLocaleString()} đ
          </button>
        </div>
      </div>
    </div>
  );
}
