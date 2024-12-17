"use client";
import { useEffect } from "react";
import { ProductCard } from "../page";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
  loadSavedProducts,
  removeProduct,
} from "../../store/SaveProduct/savedProduct.slice";

export default function LikedProducts() {
  const dispatch = useDispatch();
  const router = useRouter();

  // Access liked products from Redux state
  const likedProducts = useSelector(
    (state) => state.savedProductData.savedProducts
  );

  useEffect(() => {
    // Load saved products into Redux from localStorage when the component mounts
    dispatch(loadSavedProducts());
  }, [dispatch]);

  const handleRemove = (productId) => {
    // Remove the product from Redux state and localStorage
    dispatch(removeProduct(productId));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="w-[90%] mx-auto py-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          ← Back
        </button>

        {/* Loader */}
        {likedProducts === undefined && (
          <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}

        {/* Display Liked Products */}
        {likedProducts?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {likedProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onRemove={() => handleRemove(product._id)} // Remove handler
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg mt-10">
            No liked products found.
          </p>
        )}
      </div>
    </div>
  );
}
