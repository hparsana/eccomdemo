import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Subcategory name is required"],
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    trim: true,
  },
});

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    subcategories: [subcategorySchema],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export const Category = mongoose.model("Category", categorySchema);
