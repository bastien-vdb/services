import React from "react";

const PaymentIntentCard = ({ items, totalAmount, paymentStatus }) => {
  return (
    <div className="max-w-sm mx-auto mt-10 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">Payment Intent</div>
        <div className="mb-4">
          <p className="text-gray-700 text-base">
            <strong>Items:</strong>
          </p>
          {items.map((item, index) => (
            <p key={index} className="text-gray-600 text-sm">
              {item.name} - ${item.price.toFixed(2)}
            </p>
          ))}
        </div>
        <div className="border-t border-gray-200 pt-4">
          <p className="text-gray-700 text-base">
            <strong>Total Amount:</strong> ${totalAmount.toFixed(2)}
          </p>
          <p className="text-gray-600 text-sm mt-2">
            Payment Status: {paymentStatus}
          </p>
        </div>
        <button className="mt-6 w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default PaymentIntentCard;
