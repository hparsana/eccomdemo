"use client";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import ImageZoom from "./productZoom";
import {
  FaEdit,
  FaLaptop,
  FaShippingFast,
  FaStar,
  FaTruck,
  FaTshirt,
} from "react-icons/fa";
import { ProductCard } from "../page";
import { Pagination } from "@mui/material";
import ReviewModal from "@/app/components/dialoge/ReviewModal";
import { useDispatch, useSelector } from "react-redux";
import { getProductById } from "@/app/store/Product/productApi";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const { productId } = useParams();
  const {
    productOne: product,
    currentPage,
    loading,
    error,
  } = useSelector((state) => state.productData);
  const { userLoggedIn, authUser } = useSelector((data) => data?.userAuthData);

  const [mainImage, setMainImage] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [openAccordion, setOpenAccordion] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProductById(productId));
  }, [productId, dispatch]);

  useEffect(() => {
    if (product && product.images.length > 0) {
      setMainImage(product.images[0].url || null);
    }
  }, [product]);
  const similarProducts = product?.similarProducts;

  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const reviewsPerPage = 3;

  const paginatedReviews = product?.reviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );
  const handleAccordionToggle = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };
  const handleEditReview = (review) => {
    setSelectedReview(review); // Set the review to be edited
    setReviewModalOpen(true); // Open the modal
  };

  const handleAddReview = () => {
    if (userLoggedIn && authUser) {
      setReviewModalOpen(true); // Open the modal
    } else {
      toast.error("You are not authenticated please Login or Signup");
    }
  };

  if (!product) {
    return <div className="text-center text-gray-700">Product not found!</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen md:mb-0 mb-16">
      <div className="max-w-[1400px] mx-auto py-8 px-4 lg:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white p-6 rounded-lg shadow-md">
          {/* Product Images */}
          <div>
            {/* Only render Image component if mainImage is valid */}
            {mainImage && (
              <Image
                src={mainImage}
                alt="Product Image"
                width={700}
                height={700}
                className="rounded-lg lg:hidden block w-full h-auto object-cover"
              />
            )}
            {mainImage && <ImageZoom mainImage={mainImage} />}
            <div className="flex flex-wrap gap-4 mt-4">
              {product.images.map((img) => (
                <Image
                  key={img._id}
                  src={img.url}
                  alt={img.alt || "Product Thumbnail"}
                  width={80}
                  height={80}
                  className={`cursor-pointer object-cover md:w-[80px] w-[60px] md:h-[80px] h-[60px] border-2 rounded-lg ${
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
            <h1 className="sm:text-3xl text-xl font-bold text-gray-800">
              {product.name}
            </h1>
            <p className="text-gray-600 sm:text-lg text-sm leading-relaxed">
              {product.description}
            </p>

            {/* Price Section */}
            <div className="flex items-center gap-4 sm:text-2xl text-xl">
              <span className="text-blue-600 font-bold">₹{product.price}</span>
              <span className="text-gray-400 line-through">
                ₹{product.originalPrice}
              </span>
              <span className="text-green-600 font-semibold text-lg">
                {product.discount?.percentage}% off
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              {/* Rating Badge */}
              <div className="flex items-center bg-green-600 text-white font-semibold px-2 py-1 rounded-md">
                <span className="text-sm">{product.rating || "0.0"}</span>
                <FaStar className="w-4 h-4 ml-1" />
              </div>

              {/* Ratings and Reviews */}
              <span className="text-gray-600 text-sm font-medium">
                {`${product.reviews.length} Ratings & ${product.reviews.length || 0} Reviews`}
              </span>
            </div>

            {/* Features */}
            {product?.isFeatured && product?.features?.length !== 0 && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Key Features:
                </h3>
                <ul className="list-disc list-outside pl-5 text-gray-600">
                  {product.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sizes */}
            {product.size?.length !== 0 && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Sizes:</h3>
                <div className="flex gap-2">
                  {product.size.map((size, index) => (
                    <button
                      key={index}
                      className={`border px-3 py-1 rounded-md text-gray-700 cursor-pointer  focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                        selectedSize === size ? "bg-blue-500 text-white" : ""
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Options */}
            {product.color?.length !== 0 && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Available Colors:
                </h3>
                <div className="flex gap-3">
                  {product.color.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 cursor-pointer transition ${
                        selectedColor === color
                          ? "ring-2 ring-blue-500 scale-105"
                          : "hover:opacity-75"
                      }`}
                      style={{
                        backgroundColor: color,
                        borderColor: color === "white" ? "gray" : color,
                      }}
                    >
                      {selectedColor === color && (
                        <span className="block w-full h-full rounded-full border-4 border-white"></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Fields for Electronics */}
            {product.category === "electronics" && (
              <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-blue-700 mb-3 flex items-center">
                  <i className="text-blue-500 mr-2">
                    <FaLaptop /> {/* Example React Icon */}
                  </i>
                  Specifications
                </h3>
                <ul className="grid grid-cols-2 gap-4 text-gray-600">
                  <li>
                    <strong className="text-gray-800">Processor:</strong>{" "}
                    {product.processor || "N/A"}
                  </li>
                  <li>
                    <strong className="text-gray-800">RAM:</strong>{" "}
                    {product.ram || "N/A"}
                  </li>
                  <li>
                    <strong className="text-gray-800">Storage:</strong>{" "}
                    {product.storage || "N/A"}
                  </li>
                  <li>
                    <strong className="text-gray-800">Battery Life:</strong>{" "}
                    {product.batteryLife || "N/A"}
                  </li>
                  <li>
                    <strong className="text-gray-800">Resolution:</strong>{" "}
                    {product.resolution || "N/A"}
                  </li>
                </ul>
              </div>
            )}

            {/* Additional Fields for Apparel */}
            {product.category === "apparel" && (
              <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center">
                  <i className="text-green-500 mr-2">
                    <FaTshirt /> {/* Example React Icon */}
                  </i>
                  Apparel Details
                </h3>
                <ul className="grid grid-cols-1 gap-4 text-gray-600">
                  <li>
                    <strong className="text-gray-800">Material:</strong> Premium
                    fabric
                  </li>
                  <li>
                    <strong className="text-gray-800">Warranty:</strong>{" "}
                    {product.warranty || "N/A"}
                  </li>
                </ul>
              </div>
            )}

            {/* Shipping Info */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-purple-700 mb-3 flex items-center">
                <i className="text-purple-500 mr-2">
                  <FaShippingFast /> {/* Example React Icon */}
                </i>
                Shipping Details
              </h3>
              <ul className="grid grid-cols-1 gap-4 text-gray-600">
                <li>
                  <strong className="text-gray-800">Free Shipping:</strong>{" "}
                  {product.shippingDetails.isFreeShipping ? "Yes" : "No"}
                </li>
                <li>
                  <strong className="text-gray-800">Shipping Cost:</strong>{" "}
                  {product.shippingDetails.isFreeShipping
                    ? "Free"
                    : `₹${product.shippingDetails.shippingCost || 0}`}
                </li>
              </ul>
            </div>

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
            <div className=" grid md:grid-cols-2 items-center gap-4">
              {paginatedReviews.map((review, idx) => (
                <div
                  key={idx}
                  className="relative bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col gap-2"
                >
                  {/* Edit Icon */}
                  {userLoggedIn && authUser?._id === review?.user && (
                    <button
                      className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 hover:text-gray-900 transition"
                      onClick={() => handleEditReview(review)}
                    >
                      <FaEdit className="w-6 h-6" />
                    </button>
                  )}
                  {/* Reviewer Name and Rating */}
                  <div className="flex items-center ">
                    <span className="text-sm font-semibold text-gray-800">
                      {review.name}
                    </span>
                    <div className="flex ml-5 text-yellow-500 ">
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
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
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

            <div className="mt-8">
              <button
                onClick={handleAddReview}
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-semibold"
              >
                Write a Review
              </button>
            </div>
          </div>
          {/* Questions & Answers */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-2xl font-bold mb-4">Questions & Answers</h2>
            <div className="accordion space-y-4">
              {[...Array(2)].map((_, idx) => (
                <div key={idx} className="border rounded-lg overflow-hidden">
                  {/* Accordion Header */}
                  <button
                    className="w-full text-left bg-gray-100 px-4 py-3 font-medium text-gray-800 flex justify-between items-center"
                    onClick={() => setOpenAccordion(idx)}
                  >
                    <span>{`Question ${idx + 1}: This is a sample question.`}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 transform transition-transform ${
                        openAccordion === idx ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.918l3.71-3.688a.75.75 0 011.06 1.062l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Accordion Content */}
                  <div
                    className={`transition-all duration-300 ${
                      openAccordion === idx ? "max-h-40 p-4" : "max-h-0"
                    } overflow-hidden bg-white`}
                  >
                    <p className="text-gray-600">
                      {idx % 2 === 0
                        ? "This is the answer to the question. It provides all the necessary details."
                        : "This question has not been answered yet. Please check back later."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* Ask a Question Button */}
            <div className="mt-6">
              <button
                onClick={() => {
                  if (userLoggedIn) {
                    setReviewModalOpen(true);
                  } else {
                    toast.error("You need to log in to ask a question.");
                  }
                }}
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-semibold"
              >
                Ask a Question
              </button>
            </div>
          </div>

          {/* Review Modal */}
          <ReviewModal
            open={isReviewModalOpen}
            onClose={() => setReviewModalOpen(false)}
            productId={productId}
            review={selectedReview} // Pass selected review for editing
          />
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
