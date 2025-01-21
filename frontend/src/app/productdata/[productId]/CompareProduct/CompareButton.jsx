"use client";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCompare,
  clearCompare,
} from "@/app/store/CompareProduct/compareProduct.slice";
import { useState } from "react";
import { motion } from "framer-motion"; // For smooth animations
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";

const CompareModal = () => {
  const dispatch = useDispatch();
  const compareItems = useSelector((state) => state.compareData.compareItems);
  const [isHovered, setIsHovered] = useState(false);

  const handleRemove = (id) => {
    dispatch(removeFromCompare(id));
    toast.info("Product removed from compare list.");
  };

  if (compareItems.length === 0) return null; // Hide if no items to compare

  // Limit to max 2 products
  const displayedProducts = compareItems.slice(0, 2);

  // Dynamic width based on product count
  const modalWidth = displayedProducts.length === 1 ? "w-44" : "w-80";

  return (
    <div
      className="fixed bottom-6 right-6 z-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Compare Button */}
      {!isHovered && (
        <Link
          href={"/productdata/compareproduct"}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg hover:bg-blue-700 transition dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Compare
          <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-bold dark:bg-gray-200 dark:text-blue-700">
            {compareItems.length}
          </span>
        </Link>
      )}

      {/* Hover Effect - Modal Box */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10, x: 10 }} // Start small & from button
          animate={{ opacity: 1, scale: 1, y: -20, x: -20 }} // Expand upwards & left smoothly
          exit={{ opacity: 0, scale: 0.8, y: 10, x: 10 }} // Shrink back to button position on exit
          transition={{ duration: 0.3, ease: "easeInOut" }} // Smooth transition
          className={`absolute -bottom-5 right-0 ${modalWidth} bg-white shadow-2xl rounded-lg p-4 border border-gray-300 dark:bg-gray-800 dark:border-gray-700`}
        >
          {/* Close Button */}
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-black transition dark:text-gray-300 dark:hover:text-white"
            onClick={() => setIsHovered(false)}
          >
            ✕
          </button>

          <h3 className="text-gray-800 font-semibold text-sm mb-4 dark:text-gray-200">
            Compare List
          </h3>

          <div className="flex justify-center items-center gap-x-8">
            {displayedProducts.map((product) => (
              <div key={product.id} className="relative w-24 flex flex-col">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={70}
                  height={70}
                  className="rounded-lg w-[120px] h-[120px] object-cover border dark:border-gray-600"
                />
                <p className="text-sm mt-1 text-gray-700 dark:text-gray-300 truncate w-[90px]">
                  {product.name}
                </p>
                <button
                  onClick={() => handleRemove(product.id)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Bottom Buttons - Remove All only if more than 1 product */}
          <div className="flex justify-between mt-4">
            {displayedProducts.length === 2 && (
              <button
                onClick={() => dispatch(clearCompare())}
                className="text-red-600 text-sm font-semibold hover:underline dark:text-red-400"
              >
                REMOVE ALL
              </button>
            )}
            <Link
              href={"/productdata/compareproduct"}
              className="bg-blue-600 text-white px-5 py-3 rounded-lg flex items-center shadow-lg hover:bg-blue-700 transition dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Compare
              <span className="bg-white text-blue-600 px-3 ml-3 py-1 rounded-full text-sm font-bold dark:bg-gray-200 dark:text-blue-700">
                {compareItems.length}
              </span>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CompareModal;
