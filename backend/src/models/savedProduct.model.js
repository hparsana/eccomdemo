import mongoose from "mongoose";

const SavedProductSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Reference to the Product model
    required: true,
  },
});

export const SavedProduct = mongoose.model("SavedProduct", SavedProductSchema);
