import { Category } from "../models/category.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { addLogActivity } from "../controllers/user.controller.js";

// Add a new category
export const addCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || name.trim() === "") {
    throw new ApiError(400, "Category name is required");
  }

  // Check if a category with the same name already exists
  const existingCategory = await Category.findOne({ name: name.trim() });
  if (existingCategory) {
    throw new ApiError(400, `Category with name "${name}" already exists`);
  }

  const category = new Category({
    name: name.trim(),
    description: description?.trim(),
  });
  await category.save();
  await addLogActivity(req?.user?._id, " new Category Added", {});

  res
    .status(201)
    .json(new ApiResponse(201, category, "Category created successfully"));
});

// Get all categories
export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().lean();

  res
    .status(200)
    .json(new ApiResponse(200, categories, "Categories fetched successfully"));
});

// Get category by ID
export const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid ID format");
  }

  const category = await Category.findById(id).lean();
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, category, "Category fetched successfully"));
});

// Update a category
export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid ID format");
  }

  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  if (name) {
    const existingCategory = await Category.findOne({
      name: name.trim(),
      _id: { $ne: id },
    });
    if (existingCategory) {
      throw new ApiError(400, `Category with name "${name}" already exists`);
    }
    category.name = name.trim();
  }
  if (description) category.description = description.trim();

  await category.save();
  await addLogActivity(req?.user?._id, "  Category updated", {});

  res
    .status(200)
    .json(new ApiResponse(200, category, "Category updated successfully"));
});

// Delete a category
export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid ID format");
  }

  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  await addLogActivity(req?.user?._id, "  Category deleted", {});

  res
    .status(200)
    .json(new ApiResponse(200, null, "Category deleted successfully"));
});

// Add a subcategory
export const addSubcategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { name, description } = req.body;

  if (!name || name.trim() === "") {
    throw new ApiError(400, "Subcategory name is required");
  }

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new ApiError(400, "Invalid category ID format");
  }

  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  const existingSubcategory = category.subcategories.find(
    (sub) => sub.name === name.trim()
  );
  if (existingSubcategory) {
    throw new ApiError(400, `Subcategory with name "${name}" already exists`);
  }

  category.subcategories.push({
    name: name.trim(),
    description: description?.trim(),
  });
  await category.save();
  await addLogActivity(req?.user?._id, " new Subcategory added", {});

  res
    .status(201)
    .json(new ApiResponse(201, category, "Subcategory added successfully"));
});

// Update a subcategory
export const updateSubcategory = asyncHandler(async (req, res) => {
  const { categoryId, subcategoryId } = req.params;
  const { name, description } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(categoryId) ||
    !mongoose.Types.ObjectId.isValid(subcategoryId)
  ) {
    throw new ApiError(400, "Invalid ID format");
  }

  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  const subcategory = category.subcategories.id(subcategoryId);
  if (!subcategory) {
    throw new ApiError(404, "Subcategory not found");
  }

  if (name) {
    const duplicateSubcategory = category.subcategories.find(
      (sub) => sub.name === name.trim() && sub._id.toString() !== subcategoryId
    );
    if (duplicateSubcategory) {
      throw new ApiError(400, `Subcategory with name "${name}" already exists`);
    }
    subcategory.name = name.trim();
  }
  if (description) subcategory.description = description.trim();

  await category.save();
  await addLogActivity(req?.user?._id, "  Subcategory updated", {});

  res
    .status(200)
    .json(new ApiResponse(200, category, "Subcategory updated successfully"));
});

export const deleteSubcategory = asyncHandler(async (req, res) => {
  const { categoryId, subcategoryId } = req.params;

  // Validate IDs
  if (
    !mongoose.Types.ObjectId.isValid(categoryId) ||
    !mongoose.Types.ObjectId.isValid(subcategoryId)
  ) {
    throw new ApiError(400, "Invalid ID format");
  }

  // Find the category by ID
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  // Check if the subcategory exists
  const subcategoryIndex = category.subcategories.findIndex(
    (sub) => sub._id.toString() === subcategoryId
  );
  if (subcategoryIndex === -1) {
    throw new ApiError(404, "Subcategory not found");
  }

  // Remove the subcategory from the array
  category.subcategories.splice(subcategoryIndex, 1);

  // Save the updated category
  await category.save();
  await addLogActivity(req?.user?._id, "  Subcategory deleted", {});

  res
    .status(200)
    .json(new ApiResponse(200, category, "Subcategory deleted successfully"));
});
