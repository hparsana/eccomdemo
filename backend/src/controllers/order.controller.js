import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import mongoose from "mongoose";
import { sendOrderStatusEmail } from "../utils/mailer.js";
import { User } from "../models/user.model.js";
import { addLogActivity } from "../controllers/user.controller.js";

const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingDetails, paymentDetails, discount } = req.body;

  // Validate required fields
  if (!items || items.length === 0) {
    throw new ApiError(400, "Order must contain at least one item.");
  }
  if (!shippingDetails) {
    throw new ApiError(400, "Shipping details are required.");
  }
  if (!paymentDetails || !paymentDetails.method) {
    throw new ApiError(400, "Payment details are required.");
  }

  // Fetch product details for validation and price calculation
  const productIds = items.map((item) => item.product);
  const products = await Product.find({ _id: { $in: productIds } });

  if (products.length !== items.length) {
    throw new ApiError(400, "Some products are invalid or not found.");
  }

  let totalAmount = 0;
  const validatedItems = items.map((item) => {
    const product = products.find(
      (p) => p._id.toString() === item.product.toString()
    );

    if (!product) {
      throw new ApiError(404, `Product with ID ${item.product} not found.`);
    }

    if (product.stock < item.quantity) {
      throw new ApiError(
        400,
        `Insufficient stock for product: ${product.name}`
      );
    }

    // Calculate total amount
    const itemTotal = item.quantity * product.price;
    totalAmount += itemTotal;

    return {
      product: product._id,
      quantity: item.quantity,
      price: product.price,
    };
  });

  // Apply discount if provided
  if (discount) {
    if (discount.percentage) {
      totalAmount -= (totalAmount * discount.percentage) / 100;
    } else if (discount.amount) {
      totalAmount -= discount.amount;
    }
  }

  // Ensure totalAmount is not negative
  totalAmount = Math.max(totalAmount, 0);

  // Deduct stock temporarily (reservation)
  for (const item of validatedItems) {
    const product = products.find(
      (p) => p._id.toString() === item.product.toString()
    );
    product.stock -= item.quantity;
    await product.save();
  }

  // Create order
  const order = new Order({
    user: req.user._id,
    items: validatedItems,
    shippingDetails,
    paymentDetails: {
      method: paymentDetails.method,
      status: "Pending",
    },
    totalAmount,
    discount: discount || {},
  });

  await order.save();
  await addLogActivity(req?.user?._id, " new Order created", {});

  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order created successfully."));
});

const getOrders = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sort = "-createdAt",
    status,
    userId,
  } = req.query;

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  const query = {};
  if (status) query.orderStatus = status;
  if (userId) query.user = userId;

  // Fetch orders and count
  const [orders, totalOrders] = await Promise.all([
    Order.find(query)
      .populate("user", "fullname email")
      .populate("items.product", "name price category brand images")
      .sort(sort)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .lean(),
    Order.countDocuments(query),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      orders,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limitNumber),
      currentPage: pageNumber,
    })
  );
});

const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Order ID format.");
  }

  const order = await Order.findById(id)
    .populate("user", "fullname email")
    .populate("items.product", "name price category brand")
    .lean();

  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order fetched successfully."));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { orderStatus, paymentStatus } = req.body;

  // Validate ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Order ID format.");
  }

  const order = await Order.findById(id).populate("user", "fullname email");
  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  // Update order status and payment status
  if (orderStatus) order.orderStatus = orderStatus;
  if (paymentStatus) order.paymentDetails.status = paymentStatus;

  await order.save();

  // Send email based on the updated order status
  if (orderStatus) {
    await sendOrderStatusEmail(
      order.user.email,
      order.user.fullname,
      orderStatus
    );
  }
  await addLogActivity(req?.user?._id, "Order status updated", {});

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order status updated successfully."));
});

const cancelOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Order ID format.");
  }

  const order = await Order.findById(id);
  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  if (order.orderStatus === "Cancelled") {
    throw new ApiError(400, "Order is already cancelled.");
  }

  // Restore stock
  for (const item of order.items) {
    const product = await Product.findById(item.product);
    if (product) {
      product.stock += item.quantity;
      await product.save();
    }
  }

  order.orderStatus = "Cancelled";
  order.isCancelled = true;
  order.cancelledAt = new Date();
  await order.save();
  await addLogActivity(req?.user?._id, "Order cancelled", {});

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order cancelled successfully."));
});

const getOrdersByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Validate user ID
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid User ID format.");
  }

  const orders = await Order.find({ user: userId })
    .populate("items.product", "name price category brand")
    .sort("-createdAt")
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully."));
});

const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate order ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Order ID format.");
  }

  const order = await Order.findByIdAndDelete(id);

  if (!order) {
    throw new ApiError(404, "Order not found.");
  }
  await addLogActivity(req?.user?._id, "Order deleted", {});

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Order deleted successfully."));
});

const getOrderStats = asyncHandler(async (req, res) => {
  const [
    totalOrders,
    totalRevenue,
    totalUsers,
    totalProducts,
    // mostSoldProducts,
  ] = await Promise.all([
    // Total orders count
    Order.countDocuments(),

    // Total revenue calculation
    Order.aggregate([
      { $group: { _id: null, revenue: { $sum: "$totalAmount" } } },
    ]),

    // Total users count
    User.countDocuments(),

    // Total products count
    Product.countDocuments(),

    // Most sold products
    // Order.aggregate([
    //   { $unwind: "$items" },
    //   {
    //     $group: {
    //       _id: "$items.product",
    //       totalSold: { $sum: "$items.quantity" },
    //     },
    //   },
    //   { $sort: { totalSold: -1 } },
    //   { $limit: 5 },
    //   {
    //     $lookup: {
    //       from: "products",
    //       localField: "_id",
    //       foreignField: "_id",
    //       as: "product",
    //     },
    //   },
    //   { $unwind: "$product" },
    // ]),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      totalOrders,
      totalRevenue: totalRevenue[0]?.revenue || 0,
      totalUsers,
      totalProducts,
      // mostSoldProducts,
    })
  );
});

const updateOrderAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { address, city, state, postalCode, country } = req.body;

  // Validate Order ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Order ID format.");
  }

  // Fetch the order
  const order = await Order.findById(id);

  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  // Check if the order is modifiable
  if (["Shipped", "Delivered", "Cancelled"].includes(order.orderStatus)) {
    throw new ApiError(400, "Address cannot be updated for this order status.");
  }

  // Check if the modification is within the allowed time limit
  const orderTimeLimit = 15 * 60 * 1000; // 15 minutes
  const timeElapsed = new Date() - new Date(order.createdAt);
  if (timeElapsed > orderTimeLimit) {
    throw new ApiError(400, "The time limit to update the address has passed.");
  }

  // Update the address
  order.shippingDetails = {
    address: address || order.shippingDetails.address,
    city: city || order.shippingDetails.city,
    state: state || order.shippingDetails.state,
    postalCode: postalCode || order.shippingDetails.postalCode,
    country: country || order.shippingDetails.country,
  };

  await order.save();
  await addLogActivity(req?.user?._id, "Shipping address updated", {});

  return res
    .status(200)
    .json(
      new ApiResponse(200, order, "Shipping address updated successfully.")
    );
});

export {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getOrdersByUser,
  deleteOrder,
  getOrderStats,
  updateOrderAddress,
};
