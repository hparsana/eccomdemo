"use client";
import { useParams } from "next/navigation";
import productData from "../../components/product";
import Image from "next/image";
import { useState } from "react";
import ImageZoom from "./productZoom";
import { FaStar, FaTruck } from "react-icons/fa";
import { ProductCard } from "../page";
import { Pagination } from "@mui/material";
const ProductDetail = () => {
  const { productId } = useParams();
  const { products } = productData.data;

  const product = products.find((item) => item._id === productId);
  const [mainImage, setMainImage] = useState(product?.images[0].url);
  const similarProducts = products.slice(0, 4); // Mock Similar Products
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 3;

  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const isUserLoggedIn = true; // Mock authentication status
  const paginatedReviews = product.reviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  if (!product) {
    return <div className="text-center text-gray-700">Product not found!</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen md:mb-0mb-16">
      <div className="max-w-[1400px] mx-auto py-8 px-4 lg:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white p-6 rounded-lg shadow-md">
          {/* Product Images */}
          <div>
            {/* small devices */}
            <Image
              src={mainImage}
              alt="Product Image"
              width={700}
              height={700}
              className="rounded-lg lg:hidden block w-full h-[500px] object-cover"
            />
            <ImageZoom mainImage={mainImage} />
            <div className="flex gap-4 mt-4">
              {product.images.map((img) => (
                <Image
                  key={img._id}
                  src={img.url}
                  alt={img.alt}
                  width={80}
                  height={80}
                  className={`cursor-pointer border-2 rounded-lg ${
                    mainImage === img.url
                      ? "border-blue-500"
                      : "border-gray-300"
                  }`}
                  onClick={() => setMainImage(img.url)}
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              {product.description}
            </p>

            {/* Price Section */}
            <div className="flex items-center gap-4 text-2xl">
              <span className="text-blue-600 font-bold">₹{product.price}</span>
              <span className="text-gray-400 line-through">
                ₹{product.originalPrice}
              </span>
              <span className="text-green-600 font-semibold text-lg">
                {product.discount}
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-500">
                {Array.from({ length: Math.round(product.rating) }).map(
                  (_, i) => (
                    <FaStar key={i} />
                  )
                )}
              </div>
              <span className="text-gray-600">
                {product.rating} ({product.reviews.length} reviews)
              </span>
            </div>

            {/* Features */}
            {product.features && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Key Features:
                </h3>
                <ul className="list-disc list-inside text-gray-600">
                  {product.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sizes */}
            {product.size && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Sizes:</h3>
                <div className="flex gap-2">
                  {product.size.map((size) => (
                    <span
                      key={size}
                      className="border px-3 py-1 rounded-md text-gray-700"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-6 mt-4">
              <button className="bg-yellow-500 text-white text-lg py-3 md:px-6 px-5 rounded-lg hover:bg-yellow-600 transition">
                Add to Cart
              </button>
              <button className="bg-orange-500 text-white text-lg py-3 md:px-6 px-5 rounded-lg hover:bg-orange-600 transition">
                Buy Now
              </button>
            </div>

            {/* Delivery Info */}
            <div className="flex items-center gap-4 mt-4 text-green-600 font-semibold">
              <FaTruck className="w-5 h-5" />
              Free Delivery Available
            </div>
          </div>
        </div>
        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4">Product Details</h2>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
            hendrerit lacus at massa facilisis, vitae dictum ipsum fermentum.
          </p>
        </div>

        {/* Ratings and Reviews */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4">Ratings & Reviews</h2>

          {/* Overall Rating */}
          <div className="flex items-center gap-4 mb-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600">
                {product.ratingAverage || 4.5}
              </p>
              <p className="text-sm text-gray-500">out of 5</p>
            </div>
            <div className="flex flex-col gap-1 flex-1">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <div className="flex text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar
                        key={i}
                        className={`${
                          i < 5 - idx ? "text-yellow-500" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="h-2 bg-gray-300 flex-1 rounded-lg overflow-hidden">
                    <div
                      className="bg-yellow-500 h-full"
                      style={{ width: `${(5 - idx) * 15}%` }} // Demo percentages
                    ></div>
                  </div>
                  <span className="text-gray-500">{(5 - idx) * 20}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ratings and Reviews */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-2xl font-bold mb-4">Ratings & Reviews</h2>

            {/* User Reviews */}
            <div className="space-y-6">
              {paginatedReviews.map((review, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col gap-2"
                >
                  {/* Reviewer Name and Rating */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-800">
                      {review.reviewer}
                    </span>
                    <div className="flex text-yellow-500">
                      {Array.from({ length: Math.round(review.rating) }).map(
                        (_, i) => (
                          <FaStar key={i} />
                        )
                      )}
                    </div>
                  </div>

                  {/* Review Comment */}
                  <p className="text-gray-600 text-sm">{review.comment}</p>

                  {/* Review Date */}
                  <span className="text-xs text-gray-400">
                    {new Date(review.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-center">
              <Pagination
                count={Math.ceil(product.reviews.length / reviewsPerPage)}
                page={currentPage}
                onChange={(e, page) => setCurrentPage(page)}
                color="primary"
              />
            </div>

            {/* Write a Review */}
            {isUserLoggedIn && (
              <div className="mt-8">
                <button
                  onClick={() => setReviewModalOpen(true)}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-semibold"
                >
                  Write a Review
                </button>
              </div>
            )}
          </div>

          {/* Review Modal */}
          {/* <ReviewModal
          open={isReviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
        /> */}
        </div>

        {/* Similar Products */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Similar Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map((item) => (
              <ProductCard
                key={item._id}
                product={item}
                // Remove handler
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
