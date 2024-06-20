import React, { useState } from "react";
import PaymentIntentCard from "./PaymentIntentCard";

const ShoppingCart = ({ items }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const totalAmount = items.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="relative">
      <button
        className="flex items-center p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 focus:outline-none"
        onClick={() => setIsCartOpen(!isCartOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 6.45A2 2 0 007.6 21h8.8a2 2 0 001.95-1.55L17 13H7z"
          />
        </svg>
        ${totalAmount.toFixed(2)}
      </button>
      {isCartOpen && (
        <div className="absolute top-14 right-0 w-96 z-10">
          <PaymentIntentCard
            items={items}
            totalAmount={totalAmount}
            paymentStatus="Pending"
          />
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
