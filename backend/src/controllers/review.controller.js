import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";
import { Discount } from "../models/discount.model.js";
import mongoose from "mongoose";
import { addLogActivity } from "../controllers/user.controller.js";
const addReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user._id;

  // Validate required fields
  if (!rating || !comment) {
    throw new ApiError(400, "Rating and comment are required.");
  }

  // Validate product ID
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid Product ID format.");
  }

  // Find the product
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  // Check if the user has already reviewed the product
  const existingReview = product.reviews.find(
    (review) => review.user.toString() === userId.toString()
  );
  if (existingReview) {
    throw new ApiError(400, "You have already reviewed this product.");
  }

  // Add the review
  const newReview = {
    user: userId,
    name: req.user.fullname, // Get the user's name from the authenticated session
    rating,
    comment,
  };

  product.reviews.push(newReview);

  // Update the product's rating
  product.rating =
    product.reviews.reduce((sum, review) => sum + review.rating, 0) /
    product.reviews.length;

  await product.save();
  await addLogActivity(userId, " Review added", {});

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Review added successfully."));
});

const getReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  // Validate product ID
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid Product ID format.");
  }

  // Find the product with reviews
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

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalReviews,
        averageRating: parseFloat(averageRating.toFixed(1)),
        likePercentage: parseFloat(likePercentage.toFixed(1)),
        reviews: sortedReviews,
        topReviews,
      },
      "Reviews fetched successfully."
    )
  );
});

const updateReview = asyncHandler(async (req, res) => {
  const { productId, reviewId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user._id;

  // Validate required fields
  if (!rating || !comment) {
    throw new ApiError(400, "Rating and comment are required.");
  }

  // Validate product ID
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid Product ID format.");
  }

  // Find the product
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  // Find the review
  const review = product.reviews.find(
    (rev) =>
      rev._id.toString() === reviewId &&
      rev.user.toString() === userId.toString()
  );
  if (!review) {
    throw new ApiError(404, "Review not found or unauthorized.");
  }

  // Update the review
  review.rating = rating;
  review.comment = comment;

  // Update the product's rating
  product.rating =
    product.reviews.reduce((sum, rev) => sum + rev.rating, 0) /
    product.reviews.length;

  await product.save();
  await addLogActivity(userId, " Review updated", {});

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Review updated successfully."));
});

const deleteReview = asyncHandler(async (req, res) => {
  const { productId, reviewId } = req.params;
  const userId = req.user._id;

  // Validate product ID
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid Product ID format.");
  }

  // Find the product
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  // Find the review
  const reviewIndex = product.reviews.findIndex(
    (rev) =>
      rev._id.toString() === reviewId &&
      rev.user.toString() === userId.toString()
  );
  if (reviewIndex === -1) {
    throw new ApiError(404, "Review not found or unauthorized.");
  }

  // Remove the review
  product.reviews.splice(reviewIndex, 1);

  // Update the product's rating
  product.rating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, rev) => sum + rev.rating, 0) /
        product.reviews.length
      : 0;

  await product.save();
  await addLogActivity(userId, " Review deleted", {});

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Review deleted successfully."));
});

export { addReview, deleteReview, updateReview, getReviews };
