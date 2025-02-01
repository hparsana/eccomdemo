import NodeCache from "node-cache";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";
import mongoose from "mongoose";
import { addLogActivity } from "../controllers/user.controller.js";

const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 }); // Cache for 10 minutes

const getReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  // Validate product ID
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid Product ID format.");
  }

  // Generate cache key
  const cacheKey = `reviews_${productId}`;

  // Check if data exists in cache
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res
      .status(200)
      .json(new ApiResponse(200, cachedData, "Fetched reviews from cache."));
  }

  // Fetch product reviews from database
  const product = await Product.findById(productId).select("reviews rating");
  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  // Calculate total reviews
  const totalReviews = product.reviews.length;

  // Calculate like percentage (e.g., reviews with 4+ stars are "liked")
  const likedReviews = product.reviews.filter(
    (review) => review.rating >= 4
  ).length;
  const likePercentage =
    totalReviews > 0 ? (likedReviews / totalReviews) * 100 : 0;

  // Calculate the average rating
  const averageRating = product.rating || 0;

  // Sort reviews by latest (descending order)
  const sortedReviews = product.reviews.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Limit to top 5 reviews for preview
  const topReviews = sortedReviews.slice(0, 5);

  const responseData = {
    totalReviews,
    averageRating: parseFloat(averageRating.toFixed(1)),
    likePercentage: parseFloat(likePercentage.toFixed(1)),
    reviews: sortedReviews,
    topReviews,
  };

  // Store data in cache
  cache.set(cacheKey, responseData);

  return res
    .status(200)
    .json(new ApiResponse(200, responseData, "Reviews fetched successfully."));
});

// Add a review
const addReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user._id;

  if (!rating || !comment) {
    throw new ApiError(400, "Rating and comment are required.");
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid Product ID format.");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  const existingReview = product.reviews.find(
    (review) => review.user.toString() === userId.toString()
  );
  if (existingReview) {
    throw new ApiError(400, "You have already reviewed this product.");
  }

  const newReview = {
    user: userId,
    name: req.user.fullname,
    rating,
    comment,
  };

  product.reviews.push(newReview);
  product.rating =
    product.reviews.reduce((sum, review) => sum + review.rating, 0) /
    product.reviews.length;

  await product.save();
  await addLogActivity(userId, "Review added", {});

  // Clear cache for this product's reviews
  cache.del(`reviews_${productId}`);

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Review added successfully."));
});

// Update a review
const updateReview = asyncHandler(async (req, res) => {
  const { productId, reviewId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user._id;

  if (!rating || !comment) {
    throw new ApiError(400, "Rating and comment are required.");
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid Product ID format.");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  const review = product.reviews.find(
    (rev) =>
      rev._id.toString() === reviewId &&
      rev.user.toString() === userId.toString()
  );
  if (!review) {
    throw new ApiError(404, "Review not found or unauthorized.");
  }

  review.rating = rating;
  review.comment = comment;
  product.rating =
    product.reviews.reduce((sum, rev) => sum + rev.rating, 0) /
    product.reviews.length;

  await product.save();
  await addLogActivity(userId, "Review updated", {});

  // Clear cache for this product's reviews
  cache.del(`reviews_${productId}`);

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Review updated successfully."));
});

// Delete a review
const deleteReview = asyncHandler(async (req, res) => {
  const { productId, reviewId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid Product ID format.");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  const reviewIndex = product.reviews.findIndex(
    (rev) =>
      rev._id.toString() === reviewId &&
      rev.user.toString() === userId.toString()
  );
  if (reviewIndex === -1) {
    throw new ApiError(404, "Review not found or unauthorized.");
  }

  product.reviews.splice(reviewIndex, 1);
  product.rating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, rev) => sum + rev.rating, 0) /
        product.reviews.length
      : 0;

  await product.save();
  await addLogActivity(userId, "Review deleted", {});

  // Clear cache for this product's reviews
  cache.del(`reviews_${productId}`);

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Review deleted successfully."));
});

export { addReview, deleteReview, updateReview, getReviews };
