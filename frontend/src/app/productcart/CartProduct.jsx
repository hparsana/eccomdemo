import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CartProduct = ({ product, updateQuantity, removeItem }) => {
  const [isToastActive, setIsToastActive] = useState(false); // State to track toast activity

  const imageUrl =
    product.image && product.image.length > 0
      ? product.image[0]?.url
      : "/placeholder-image.jpg"; // Fallback to a placeholder image

  const handleQuantityChange = (newQuantity) => {
    if (isToastActive) return; // Prevent interactions if toast is active

    if (newQuantity < 1) {
      setIsToastActive(true);
      toast.error("Quantity cannot be less than 1.", {
        autoClose: 1000,
        onClose: () => setIsToastActive(false), // Reset state when toast closes
      });
      return;
    }

    if (newQuantity > 5) {
      setIsToastActive(true);
      toast.warn("You can add a maximum of 5 items.", {
        autoClose: 1000,
        onClose: () => setIsToastActive(false), // Reset state when toast closes
      });
      return;
    }

    updateQuantity(product.id, newQuantity);
    setIsToastActive(true);
    toast.success(`Quantity updated to ${newQuantity}`, {
      autoClose: 1000,
      onClose: () => setIsToastActive(false), // Reset state when toast closes
    });
  };

  const handleRemoveItem = () => {
    if (isToastActive) return; // Prevent interactions if toast is active

    setIsToastActive(true);
    removeItem(product.id);
    toast.success("Item removed from the cart.", {
      autoClose: 1000,
      onClose: () => setIsToastActive(false), // Reset state when toast closes
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-wrap items-start gap-4 dark:bg-gray-800">
      <img
        src={imageUrl}
        alt={product.name || "Product Image"}
        className="w-24 h-24 object-cover rounded"
      />
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Brand: {product?.brand}
        </p>
        <div className="flex gap-x-5 mt-1">
          {product.color && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Color: {product.color}
            </p>
          )}
          {product.size && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Size: {product.size}
            </p>
          )}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {product.description}
        </p>
        <div className="flex items-center mt-2">
          <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
            ₹{product.price}
          </span>
          <span className="text-sm text-gray-500 line-through ml-2 dark:text-gray-500">
            ₹{product.originalPrice}
          </span>
          <span className="text-sm text-green-600 ml-2 dark:text-green-400">
            {product.discount?.percentage}% Off
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1 dark:text-gray-400">
          <span className="text-gray-800 font-medium dark:text-gray-300">
            Discount Details:
          </span>
          <span className="text-green-600 font-semibold dark:text-green-400">
            {" "}
            Save ₹{product.discount?.amount}
          </span>
          <span className="text-gray-600 md:ml-2 dark:text-gray-400">
            Valid from
          </span>
          <span className="text-blue-500 dark:text-blue-400">
            {" "}
            {new Date(product.discount?.startDate).toLocaleDateString()}
          </span>
          <span className="text-gray-600 dark:text-gray-400"> to</span>
          <span className="text-blue-500 dark:text-blue-400">
            {" "}
            {new Date(product.discount?.endDate).toLocaleDateString()}
          </span>
        </p>

        <div className="flex items-center mt-3 space-x-4">
          <div className="flex items-center border border-gray-300 rounded-md dark:border-gray-600">
            <button
              onClick={() => handleQuantityChange(product.quantity - 1)}
              className={`px-3 py-1 ${
                isToastActive ? "cursor-not-allowed opacity-50" : ""
              } dark:text-gray-200`}
              disabled={isToastActive}
            >
              -
            </button>
            <input
              type="text"
              value={product.quantity}
              readOnly
              className="w-12 text-center border-none focus:outline-none dark:bg-gray-700 dark:text-gray-200"
            />
            <button
              onClick={() => handleQuantityChange(product.quantity + 1)}
              className={`px-3 py-1 ${
                isToastActive ? "cursor-not-allowed opacity-50" : ""
              } dark:text-gray-200`}
              disabled={isToastActive}
            >
              +
            </button>
          </div>
          <button
            onClick={handleRemoveItem}
            className={`text-red-600 hover:underline ${
              isToastActive ? "cursor-not-allowed opacity-50" : ""
            } dark:text-red-400`}
            disabled={isToastActive}
          >
            REMOVE
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartProduct;
