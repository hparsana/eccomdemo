import NodeCache from "node-cache";
import { SavedProduct } from "../models/savedProduct.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 }); // Cache for 10 minutes

// Get all saved products for a user
export const getSavedProducts = asyncHandler(async (req, res) => {
  const cacheKey = `savedProducts_${req.user._id}`;

  // Check if data exists in cache
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, cachedData, "Fetched saved products from cache.")
      );
  }

  // Fetch from database if not cached
  let savedProducts = await SavedProduct.find({ user: req.user._id }).populate(
    "productId", // Populate productId with product details
    "name price images description stock category brand color size"
  );

  // Transform the response to remove `productId` and merge its fields into the top level
  savedProducts = savedProducts.map((item) => {
    const { productId, ...rest } = item.toObject(); // Convert Mongoose document to plain object
    return {
      ...rest,
      ...productId, // Merge productId fields into the top level
    };
  });

  // Store in cache
  cache.set(cacheKey, savedProducts);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        savedProducts,
        "Fetched saved products successfully."
      )
    );
});

// Add a product to saved items
export const addSavedProduct = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    throw new ApiError(400, "Product ID is required.");
  }

  const alreadySaved = await SavedProduct.findOne({
    user: req.user._id,
    productId,
  });
  if (alreadySaved) {
    throw new ApiError(400, "Product is already saved.");
  }

  const savedProduct = await SavedProduct.create({
    user: req.user._id,
    productId,
  });

  // Clear cache after adding
  cache.del(`savedProducts_${req.user._id}`);

  return res
    .status(201)
    .json(new ApiResponse(201, savedProduct, "Product saved successfully."));
});

// Remove a product from saved items
export const removeSavedProduct = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    throw new ApiError(400, "Product ID is required.");
  }

  await SavedProduct.findOneAndDelete({ user: req.user._id, productId });

  // Clear cache after removal
  cache.del(`savedProducts_${req.user._id}`);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Product removed successfully."));
});
