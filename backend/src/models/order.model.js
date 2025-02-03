import mongoose from "mongoose";

const ORDER_STATUSES = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        color: {
          type: String,
        },
      },
    ],
    shippingDetails: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentDetails: {
      method: {
        type: String,
        enum: ["Credit Card", "PayPal", "Cash on Delivery", "card"],
        required: true,
      },
      status: {
        type: String,
        enum: ["Pending", "Paid", "Failed", "Refunded"],
        default: "Pending",
      },
      transactionId: {
        type: String,
        validate: {
          validator: function (v) {
            return this.paymentDetails.status !== "Paid" || v;
          },
          message: "Transaction ID is required for paid orders.",
        },
      },
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      percentage: { type: Number, min: 0, max: 100 },
      amount: { type: Number, min: 0 },
    },
    orderStatus: {
      type: String,
      enum: ORDER_STATUSES,
      default: "Pending",
    },
    trackingDetails: {
      carrier: { type: String },
      trackingNumber: { type: String },
      estimatedDelivery: { type: Date },
    },
    isDelivered: { type: Boolean, default: false },
    isProcessingAt: { type: Date },
    isShippedAt: { type: Date },
    deliveredAt: { type: Date },

    isCancelled: { type: Boolean, default: false },
    cancelledAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Virtual Field for Total Items
orderSchema.virtual("totalItems").get(function () {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Auto-set Processing Date
orderSchema.pre("save", function (next) {
  if (this.orderStatus === "Processing" && !this.isProcessingAt) {
    this.isProcessingAt = new Date();
  }
  next();
});
// Auto-set Shipped Date
orderSchema.pre("save", function (next) {
  if (this.orderStatus === "Shipped" && !this.isShippedAt) {
    this.isShippedAt = new Date();
  }
  next();
});
// Auto-set Delivered Date
orderSchema.pre("save", function (next) {
  if (this.orderStatus === "Delivered" && !this.deliveredAt) {
    this.deliveredAt = new Date();
  }
  next();
});
// Auto-set Cancelled Date
orderSchema.pre("save", function (next) {
  if (this.orderStatus === "Cancelled" && !this.cancelledAt) {
    this.cancelledAt = new Date();
  }
  next();
});

// Indexes for Optimization
orderSchema.index({ user: 1, orderStatus: 1, createdAt: -1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ "paymentDetails.status": 1 });
orderSchema.index({ isDelivered: 1 });

export const Order = mongoose.model("Order", orderSchema);
