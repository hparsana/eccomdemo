"use client";
import { useEffect } from "react";
import { ProductCard } from "../page";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchSavedProducts,
  unsaveProduct,
} from "@/app/store/SaveProduct/savedProductApi";

export default function LikedProducts() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { userLoggedIn } = useSelector((state) => state.userAuthData);
  const likedProducts = useSelector(
    (state) => state.savedProductData.savedProducts
  );
  console.log("get like product", likedProducts);

  useEffect(() => {
    dispatch(fetchSavedProducts());
  }, [dispatch, userLoggedIn]);

  const handleRemove = (productId) => {
    dispatch(unsaveProduct(productId));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="w-[90%] mx-auto py-6">
        <button
          onClick={() => router.back()}
          className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          ← Back
        </button>

        {likedProducts?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {likedProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onRemove={() => handleRemove(product._id)}
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
