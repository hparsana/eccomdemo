"use client";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCompare,
  clearCompare,
} from "@/app/store/CompareProduct/compareProduct.slice";
import Image from "next/image";
import { FaStar, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const ComparePage = () => {
  const dispatch = useDispatch();
  const compareItems = useSelector((state) => state.compareData.compareItems);

  if (compareItems.length < 1)
    return (
      <p className="text-center mt-10 text-gray-700 dark:text-gray-300">
        No products selected for comparison.
      </p>
    );

  // Limit to max 2 products
  const displayedProducts = compareItems.slice(0, 2);

  const handleRemove = (id) => {
    dispatch(removeFromCompare(id));
    toast.info("Product removed from compare list.");
  };

  return (
    <div className="bg-gray-100 min-h-screen p-10 dark:bg-gray-900">
      <div className="max-w-[1200px] mx-auto bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
          Compare {displayedProducts.map((p) => p.name).join(" vs ")}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {displayedProducts.length} items
        </p>

        <div className="grid grid-cols-2 gap-6 border-b pb-6">
          {displayedProducts.map((product) => (
            <div
              key={product.id}
              className="relative bg-gray-50 p-4 rounded-lg shadow-md dark:bg-gray-700"
            >
              {/* Remove Button */}
              <button
                className="absolute top-3 right-3 bg-gray-300 p-2 rounded-full hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
                onClick={() => handleRemove(product.id)}
              >
                <FaTimes size={16} />
              </button>

              {/* Product Image */}
              <div className="flex justify-center mb-4">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={150}
                  height={150}
                  className="rounded-lg w-[150px] h-[150px] object-cover"
                />
              </div>

              {/* Product Name */}
              <h3 className="text-lg font-semibold text-center text-gray-800 dark:text-gray-200">
                {product.name}
              </h3>

              {/* Product Price */}
              <p className="text-center text-blue-600 dark:text-blue-400 font-bold text-lg mt-2">
                ₹{product.price}
              </p>
              {product.originalPrice && (
                <p className="text-center text-gray-500 dark:text-gray-400 line-through">
                  ₹{product.originalPrice}
                </p>
              )}

              {/* Rating */}
              <div className="flex justify-center items-center mt-2">
                <div className="bg-green-500 text-white px-2 py-1 rounded-md flex items-center">
                  <span className="text-sm">{product.rating || "0.0"}</span>
                  <FaStar className="ml-1 text-xs" />
                </div>
                <span className="ml-2 text-gray-600 dark:text-gray-300 text-sm">{`${product.reviews?.length || 0} Reviews`}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-300 mb-4">
            Ratings & Reviews
          </h3>
          <div className="grid grid-cols-2 gap-6">
            {displayedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-gray-50 p-4 rounded-lg shadow-md dark:bg-gray-700"
              >
                <div className="bg-green-500 text-white px-2 py-1 rounded-md flex items-center w-fit">
                  <span className="text-sm">{product.rating || "0.0"}</span>
                  <FaStar className="ml-1 text-xs" />
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                  {product.reviews?.length || 0} Reviews
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* General Features */}
        <div className="mt-6 border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-300 mb-4">
            Highlights
          </h3>
          <div className="grid grid-cols-2 gap-6">
            {displayedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-gray-50 p-4 rounded-lg shadow-md dark:bg-gray-700"
              >
                <ul className="text-gray-600 dark:text-gray-300 text-sm space-y-1">
                  {product.features
                    ?.slice(0, 5)
                    .map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    )) || <li>No features listed</li>}
                </ul>
              </div>
            ))}
          </div>
        </div>
        {/* Variants Comparison */}
        <div className="mt-6 border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-300 mb-4">
            Variants
          </h3>
          <div className="grid grid-cols-2 gap-6">
            {displayedProducts.map((product, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-lg shadow-md dark:bg-gray-700"
              >
                <p className="text-gray-800 dark:text-gray-300 font-medium">
                  Color:
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {product.color?.join(", ") || "N/A"}
                </p>
                {product?.subcategory === "Mobile Phones" && (
                  <div>
                    <p className="text-gray-800 dark:text-gray-300 font-medium mt-2">
                      Storage:
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {product.storage || "N/A"}
                    </p>
                    <p className="text-gray-800 dark:text-gray-300 font-medium mt-2">
                      RAM:
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {product.ram || "N/A"}
                    </p>
                  </div>
                )}
                {product?.category === "Shoes" && (
                  <div className="mt-3">
                    <p className="text-gray-800 dark:text-gray-300 font-medium">
                      Size:
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {product.size?.join(", ") || "N/A"}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparePage;
