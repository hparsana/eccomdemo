import express from "express";
import {
  addCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  addSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from "../controllers/category.controller.js";
import { authMiddleWare } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Category routes
router
  .route("/")
  .post(authMiddleWare(["ADMIN"]), addCategory) // Add a category
  .get(getAllCategories); // Get all categories

router
  .route("/:id")
  .get(getCategoryById) // Get category by ID
  .put(authMiddleWare(["ADMIN"]), updateCategory) // Update a category
  .delete(authMiddleWare(["ADMIN"]), deleteCategory); // Delete a category

// Subcategory routes
router
  .route("/subcategories/:categoryId")
  .post(authMiddleWare(["ADMIN"]), addSubcategory); // Add a subcategory

router
  .route("/:categoryId/subcategories/:subcategoryId")
  .put(authMiddleWare(["ADMIN"]), updateSubcategory) // Update a subcategory
  .delete(authMiddleWare(["ADMIN"]), deleteSubcategory); // Delete a subcategory

export default router;
