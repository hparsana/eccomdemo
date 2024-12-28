import mongoose from "mongoose";

const generalSpecificationSchema = new mongoose.Schema({
  key: {
    type: String,
    // required: [true, "Specification key is required"],
    trim: true,
  },
  value: {
    type: String,
    // required: [true, "Specification value is required"],
    trim: true,
  },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price must be a positive value"],
    },
    originalPrice: {
      type: Number,
      required: false,
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
    },
    subcategory: {
      type: String,
      // required: [true, "Product category is required"],
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
    },

    weight: {
      type: Number,
      default: 0, // Weight in kilograms
    },
    dimensions: {
      length: { type: Number, default: 0 },
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
    },
    size: {
      type: [String],
      default: [],
    },
    color: {
      type: [String],
      default: [],
    },
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, default: "Product Image" },
      },
    ],
    warranty: {
      type: String,
      default: "No warranty",
    },
    batteryLife: {
      type: String,
      default: "N/A",
    },
    features: {
      type: [String],
      default: [],
    },
    resolution: {
      type: String,
      default: "N/A",
    },
    processor: {
      type: String,
      default: "N/A",
    },
    ram: {
      type: String,
      default: "N/A",
    },
    storage: {
      type: String,
      default: "N/A",
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be more than 5"],
    },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: { type: String, required: true },
        rating: {
          type: Number,
          required: true,
          min: [0, "Rating cannot be less than 0"],
          max: [5, "Rating cannot be more than 5"],
        },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
    availability: {
      type: String,
      enum: ["In Stock", "Out of Stock", "Preorder"],
      default: "In Stock",
    },
    vendor: {
      type: String,
      default: "Default Vendor",
    },
    shippingDetails: {
      isFreeShipping: { type: Boolean, default: false },
      shippingCost: { type: Number, default: 0 },
      shippingRegions: { type: [String], default: [] },
    },
    generalSpecifications: {
      type: [generalSpecificationSchema], // Embed general specifications
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

productSchema.index({ name: "text", description: "text", brand: "text" });

export const Product = mongoose.model("Product", productSchema);
