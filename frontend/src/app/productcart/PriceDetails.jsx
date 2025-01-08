import React from "react";

const PriceDetails = ({ totalData, itemsCount }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 dark:text-gray-200">
        PRICE DETAILS
      </h2>
      <div className="space-y-2">
        <div className="flex justify-between text-gray-700 dark:text-gray-300">
          <span>Price ({itemsCount} items)</span>
          <span>₹{totalData.totalPrice}</span>
        </div>
        <div className="flex justify-between text-green-600 dark:text-green-400">
          <span>Discount</span>
          <span>- ₹{totalData.discount}</span>
        </div>
        <div className="flex justify-between text-gray-700 dark:text-gray-300">
          <span>Delivery Charges</span>
          <span>
            {totalData.deliveryCharge === 0
              ? "Free"
              : `₹${totalData.deliveryCharge}`}
          </span>
        </div>
        <div className="border-t border-gray-300 dark:border-gray-600 my-2"></div>
        <div className="flex justify-between font-bold text-gray-800 dark:text-gray-200">
          <span>Total Amount</span>
          <span>₹{totalData.totalAmount}</span>
        </div>
        <p className="text-green-600 text-lg mt-2 dark:text-green-400">
          You will save ₹{totalData.discount} on this order.
        </p>
      </div>
    </div>
  );
};

export default PriceDetails;
