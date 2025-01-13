"use client";
import { redirect, useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import ImageZoom from "./productZoom";
import {
  FaClipboardList,
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
import { addItemToCart } from "@/app/store/Cart/cart.slice";
import RecentlyViewed from "./RecentlyViewed";
import RatingsAndReviews from "./RattingBar";
import ProductImageSlider from "./ProductImageSlider";
import GeneralInfo from "./generalInfo";

const ProductDetail = () => {
  const { productId } = useParams();
  const {
    productOne: product,
    currentPage,
    loading,
    error,
  } = useSelector((state) => state.productData);
  const { userLoggedIn, authUser } = useSelector((data) => data?.userAuthData);
  const cartItems = useSelector((state) => state.cartData.cartItems);

  const [mainImage, setMainImage] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState({
    index: 0,
    color: null,
  });
  const [openAccordion, setOpenAccordion] = useState(0);
  const [recentViews, setRecentViews] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProductById(productId));
  }, [productId, dispatch]);

  useEffect(() => {
    if (product && product.images.length > 0) {
      setMainImage(product.images[0].url || null);
    }
  }, [product]);

  useEffect(() => {
    if (product) {
      const recentViews = JSON.parse(localStorage.getItem("recentViews")) || [];

      // Remove duplicates
      const updatedViews = recentViews.filter(
        (item) => item._id !== product._id
      );

      // Add the current product
      updatedViews.push({
        _id: product._id,
        name: product.name,
        brand: product.brand,
        image: product.images[0]?.url || "",
        price: product.price,
        lastViewed: new Date().toISOString(),
      });

      // Limit to last 10 products
      if (updatedViews.length > 10) {
        updatedViews.shift();
      }

      // Save to localStorage
      localStorage.setItem("recentViews", JSON.stringify(updatedViews));
    }
  }, [product]);

  useEffect(() => {
    const storedRecentViews =
      JSON.parse(localStorage.getItem("recentViews")) || [];
    setRecentViews(storedRecentViews);
  }, []);

  const similarProducts = product?.similarProducts;
  const youMightBeInterestedIn = product?.youMightBeInterestedIn;
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const reviewsPerPage = 3;

  const paginatedReviews = product?.reviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );
  const handleAccordionToggle = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };
  const handleAddToCart = () => {
    if (!product) return;

    dispatch(
      addItemToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images || "",
        discount: product?.discount || {},
        brand: product?.brand || "",
        quantity: 1,
        size: selectedSize || product.size[0],
        color: selectedColor?.color || product.color[0],
      })
    );

    toast.success("Product added to cart!");
  };
  const handleGoToCart = () => {
    redirect("/productcart");
  };

  const isInCart = cartItems?.some((item) => item.id === product?._id); // Check if product is in the cart

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
  if (loading) {
    return (
      <div className="text-center text-gray-700">Product is Loading..!</div>
    );
  }
  if (!product) {
    return <div className="text-center text-gray-700">Product not found!</div>;
  }

  const handleInterestedClick = (id) => {
    redirect(`/productdata/${id}`);
  };

  return (
    <div className="bg-gray-100 min-h-screen md:mb-0 mb-16 dark:bg-gray-900">
      <div className="max-w-[1500px] mx-auto py-8 md:px-4 px-2 lg:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:gap-10 gap-5 bg-white md:p-6 p-2 rounded-lg shadow-md dark:bg-gray-800">
          {/* Product Images */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            {/* Only render Image component if mainImage is valid */}
            {mainImage && <ProductImageSlider images={product?.images} />}
            <div className="lg:flex hidden flex-col md:flex-row gap-5 items-center md:items-start">
              {/* Thumbnail Images */}
              <div className="flex lg:flex-col lg:mt-0 mt-4 flex-wrap gap-4">
                {product.images.map((img) => (
                  <Image
                    key={img._id}
                    src={img.url}
                    alt={img.alt || "Product Thumbnail"}
                    width={100}
                    height={100}
                    className={`cursor-pointer object-cover w-[60px] h-[60px] md:w-[70px] md:h-[70px] border-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                      mainImage === img.url
                        ? "border-blue-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    onClick={() => setMainImage(img.url)}
                  />
                ))}
              </div>

              {/* Main Image with Zoom */}
              {mainImage && (
                <div className="flex-1">
                  <ImageZoom mainImage={mainImage} product={product} />
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-center mx-auto gap-6 lg:mt-6 mt-10 w-full">
              {isInCart ? (
                <button
                  className="bg-[#ff9f00] text-white lg:ml-[88px] text-lg py-3 w-full md:px-6 px-5 rounded-lg hover:bg-orange-400 transition"
                  onClick={handleGoToCart}
                >
                  Go to Cart
                </button>
              ) : (
                <button
                  className="bg-yellow-500 text-white lg:ml-[88px] text-lg w-full py-3 md:px-6 px-5 rounded-lg hover:bg-yellow-600 transition"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              )}
              <button className="bg-[#fb641b] text-white text-lg py-3 w-full md:px-6 px-5 rounded-lg hover:bg-orange-600 transition">
                Buy Now
              </button>
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-6">
            <h1 className="sm:text-3xl text-xl font-bold text-gray-800 dark:text-gray-200">
              {product.name}
            </h1>
            <p className="text-gray-600 sm:text-lg text-sm leading-relaxed dark:text-gray-400">
              {product.description}
            </p>
            {/* Price Section */}
            <div className="flex items-center gap-4 sm:text-2xl text-xl">
              <span className="text-blue-600 font-bold dark:text-blue-400">
                ₹{product.price}
              </span>
              <span className="text-gray-400 line-through dark:text-gray-500">
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
              <span className="text-gray-600 text-sm font-medium dark:text-gray-400">
                {`${product.reviews.length} Ratings & ${product.reviews.length || 0} Reviews`}
              </span>
            </div>
            {/* Features */}
            {product?.isFeatured && product?.features?.length !== 0 && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2 dark:text-gray-300">
                  Key Features:
                </h3>
                <ul className="list-disc list-outside pl-5 text-gray-600 dark:text-gray-400">
                  {product.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            {/* Sizes */}
            {product.size?.length !== 0 && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2 dark:text-gray-300">
                  Sizes:
                </h3>
                <div className="flex gap-2">
                  {product.size.map((size, index) => (
                    <button
                      key={index}
                      className={`border px-3 py-1 rounded-md text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                        selectedSize === size
                          ? "bg-blue-500 text-white"
                          : "dark:text-gray-300"
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
            {product.color?.length !== 0 && product.images?.length !== 0 && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2 dark:text-gray-300">
                  Available Colors:
                </h3>
                <div className="flex gap-4">
                  {product.color.map((color, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <button
                        onClick={() => setSelectedColor({ index: idx, color })}
                        className={`w-16 h-16 rounded-md border-2 cursor-pointer transition ${
                          selectedColor.index === idx
                            ? "ring-2 ring-blue-500"
                            : "hover:opacity-75 dark:border-gray-600"
                        }`}
                        style={{
                          borderColor:
                            selectedColor.index === idx ? "blue" : "gray",
                        }}
                      >
                        <img
                          src={product.images[idx]?.url}
                          alt={`Color option ${color}`}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </button>
                      <span className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        {color}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Additional Fields for Electronics */}
            {product.category === "electronics" && (
              <div className="bg-gray-100 p-4 rounded-lg shadow-md dark:bg-gray-700">
                <h3 className="text-lg font-semibold text-blue-700 mb-3 flex items-center dark:text-blue-400">
                  <i className="text-blue-500 mr-2">
                    <FaLaptop />
                  </i>
                  Specifications
                </h3>
                <ul className="grid grid-cols-2 gap-4 text-gray-600 dark:text-gray-400">
                  <li>
                    <strong className="text-gray-800 dark:text-gray-300">
                      Processor:
                    </strong>{" "}
                    {product.processor || "N/A"}
                  </li>
                  <li>
                    <strong className="text-gray-800 dark:text-gray-300">
                      RAM:
                    </strong>{" "}
                    {product.ram || "N/A"}
                  </li>
                  <li>
                    <strong className="text-gray-800 dark:text-gray-300">
                      Storage:
                    </strong>{" "}
                    {product.storage || "N/A"}
                  </li>
                  <li>
                    <strong className="text-gray-800 dark:text-gray-300">
                      Battery Life:
                    </strong>{" "}
                    {product.batteryLife || "N/A"}
                  </li>
                  <li>
                    <strong className="text-gray-800 dark:text-gray-300">
                      Resolution:
                    </strong>{" "}
                    {product.resolution || "N/A"}
                  </li>
                </ul>
              </div>
            )}
            {/* Additional Fields for Apparel */}
            {product.category === "apparel" && (
              <div className="bg-gray-100 p-4 rounded-lg shadow-md dark:bg-gray-700">
                <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center dark:text-green-400">
                  <i className="text-green-500 mr-2">
                    <FaTshirt />
                  </i>
                  Apparel Details
                </h3>
                <ul className="grid grid-cols-1 gap-4 text-gray-600 dark:text-gray-400">
                  <li>
                    <strong className="text-gray-800 dark:text-gray-300">
                      Material:
                    </strong>{" "}
                    Premium fabric
                  </li>
                  <li>
                    <strong className="text-gray-800 dark:text-gray-300">
                      Warranty:
                    </strong>{" "}
                    {product.warranty || "N/A"}
                  </li>
                </ul>
              </div>
            )}
            {/* General Specifications */}
            {product.generalSpecifications?.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg shadow-md dark:bg-gray-700">
                <h3 className="text-lg font-semibold text-blue-700 mb-3 flex items-center dark:text-blue-400">
                  <i className="text-blue-500 mr-2">
                    <FaClipboardList />
                  </i>
                  General Specifications
                </h3>
                <ul className="grid grid-cols-1 gap-4 text-gray-600 dark:text-gray-400">
                  {product.generalSpecifications.map((spec, index) => (
                    <li key={index} className="flex items-center">
                      <strong className="text-gray-800 mr-2 dark:text-gray-300">
                        {spec.key}:
                      </strong>
                      <span>{spec.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* General Info */}
            {product?.subcategory === "Mobile Phones" && (
              <GeneralInfo product={product} />
            )}
            {/* Shipping Info */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-md dark:bg-gray-700">
              <h3 className="text-lg font-semibold text-purple-700 mb-3 flex items-center dark:text-purple-400">
                <i className="text-purple-500 mr-2">
                  <FaShippingFast />
                </i>
                Shipping Details
              </h3>
              <ul className="grid grid-cols-1 gap-4 text-gray-600 dark:text-gray-400">
                <li>
                  <strong className="text-gray-800 dark:text-gray-300">
                    Free Shipping:
                  </strong>{" "}
                  {product.shippingDetails.isFreeShipping ? "Yes" : "No"}
                </li>
                <li>
                  <strong className="text-gray-800 dark:text-gray-300">
                    Shipping Cost:
                  </strong>{" "}
                  {product.shippingDetails.isFreeShipping
                    ? "Free"
                    : `₹${product.shippingDetails.shippingCost || 0}`}
                </li>
              </ul>
            </div>
            {/* Delivery Info */}
            <div className="flex items-center gap-4 mt-4 text-green-600 font-semibold dark:text-green-400">
              <FaTruck className="w-5 h-5" />
              Free Delivery Available
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8 dark:bg-gray-700">
          <h2 className="text-2xl font-bold mb-4 dark:text-gray-200">
            Product Details
          </h2>
          <p className="text-gray-600 dark:text-gray-200">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
            hendrerit lacus at massa facilisis, vitae dictum ipsum fermentum.
          </p>
        </div>

        {/* Ratings and Reviews */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8 dark:bg-gray-700">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            Ratings & Reviews
          </h2>

          {/* Overall Rating */}

          <RatingsAndReviews
            category={product?.subcategory || "electronics"}
            reviews={product?.reviews}
          />
          {/* Ratings and Reviews */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-8 dark:bg-gray-700">
            {/* <h2 className="text-2xl font-bold mb-4">Ratings & Reviews</h2> */}

            {/* User Reviews */}
            <div className="grid md:grid-cols-2 items-center gap-4">
              {paginatedReviews.map((review, idx) => (
                <div
                  key={idx}
                  className="relative bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col gap-2 dark:bg-gray-800 dark:border-gray-600"
                >
                  {/* Edit Icon */}
                  {userLoggedIn && authUser?._id === review?.user && (
                    <button
                      className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 hover:text-gray-900 transition dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500 dark:hover:text-gray-100"
                      onClick={() => handleEditReview(review)}
                    >
                      <FaEdit className="w-6 h-6" />
                    </button>
                  )}
                  {/* Reviewer Name and Rating */}
                  <div className="flex items-center">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {review.name}
                    </span>
                    <div className="flex ml-5 text-yellow-500">
                      {Array.from({ length: Math.round(review.rating) }).map(
                        (_, i) => (
                          <FaStar key={i} />
                        )
                      )}
                    </div>
                  </div>

                  {/* Review Comment */}
                  <p className="text-gray-600 text-sm dark:text-gray-400">
                    {review.comment}
                  </p>

                  {/* Review Date */}
                  <span className="text-xs text-gray-400 dark:text-gray-500">
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
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-semibold dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                Write a Review
              </button>
            </div>
          </div>
          {/* You might be interested in */}

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              You might be interested in
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {youMightBeInterestedIn?.map((item, key) => (
                <div
                  className="flex items-center bg-white p-1 shadow-md dark:bg-gray-700"
                  key={key}
                >
                  <Image
                    src={item?.images[1]?.url}
                    alt="Product Image"
                    width={700}
                    height={700}
                    className="rounded-lg md:w-[200px] w-[100px] md:h-[200px] h-[100px] object-cover"
                  />
                  <div className="md:ml-3 ml-1">
                    <h3 className="md:text-[20px] text-[15px] font-mono text-gray-800 dark:text-gray-200">
                      {item?.name}
                    </h3>
                    <h3 className="text-gray-800 dark:text-gray-200">
                      <span className="text-[20px] font-semibold font-mono">
                        Brand:{" "}
                      </span>
                      {item?.brand}
                    </h3>
                    <button
                      className="bg-blue-400 px-3 py-1 md:mt-3 mt-1 text-white dark:bg-blue-600"
                      onClick={() => handleInterestedClick(item?._id)}
                    >
                      Shop Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Questions & Answers */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-8 dark:bg-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              Questions & Answers
            </h2>
            <div className="accordion space-y-4">
              {[...Array(2)].map((_, idx) => (
                <div
                  key={idx}
                  className="border rounded-lg overflow-hidden dark:border-gray-600"
                >
                  {/* Accordion Header */}
                  <button
                    className="w-full text-left bg-gray-100 px-4 py-3 font-medium text-gray-800 flex justify-between items-center dark:bg-gray-600 dark:text-gray-200"
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
                    } overflow-hidden bg-white dark:bg-gray-800`}
                  >
                    <p className="text-gray-600 dark:text-gray-400">
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
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-semibold dark:bg-blue-700 dark:hover:bg-blue-800"
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
        <div className="bg-gray-50 p-6 rounded-lg shadow-md mt-8 dark:bg-gray-800">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            Similar Products
          </h2>
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

        <RecentlyViewed recentViews={recentViews} />
      </div>
    </div>
  );
};

export default ProductDetail;
