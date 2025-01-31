import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import mongoose from "mongoose";
import Stripe from "stripe";
import {
  sendContactEmail,
  sendNewOrderEmail,
  sendOrderStatusEmail,
} from "../utils/mailer.js";
import { User } from "../models/user.model.js";
import { addLogActivity } from "../controllers/user.controller.js";
import { Category } from "../models/category.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Using import method

const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingDetails, paymentDetails, discount } = req.body;

  // Validate input
  if (!items || items.length === 0) {
    throw new ApiError(400, "Order must contain at least one item.");
  }
  if (!shippingDetails) {
    throw new ApiError(400, "Shipping details are required.");
  }
  if (!paymentDetails || !paymentDetails.transactionId) {
    throw new ApiError(400, "Valid payment transaction ID is required.");
  }

  // Verify payment intent with Stripe
  let paymentIntent;
  try {
    paymentIntent = await stripe.paymentIntents.retrieve(
      paymentDetails.transactionId
    );
  } catch (error) {
    console.error("Stripe payment intent retrieval failed:", error);
    throw new ApiError(400, "Payment verification failed.");
  }

  if (!paymentIntent || paymentIntent.status !== "succeeded") {
    throw new ApiError(400, "Payment verification failed.");
  }

  // Fetch product details securely
  const productIds = items.map((item) => item.product);
  const products = await Product.find({ _id: { $in: productIds } });

  if (products.length !== items.length) {
    throw new ApiError(400, "Some products are invalid or not found.");
  }

  let totalAmount = 0;
  const validatedItems = [];

  for (const item of items) {
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

    const itemTotal = item.quantity * product.price;
    totalAmount += itemTotal;

    validatedItems.push({
      product: product._id,
      quantity: item.quantity,
      color: item.color,
      price: product.price,
    });
  }

  // Apply discount securely
  if (discount) {
    if (discount.percentage) {
      totalAmount -= (totalAmount * discount.percentage) / 100;
    } else if (discount.amount) {
      totalAmount -= discount.amount;
    }
  }

  totalAmount = Math.max(totalAmount, 0);

  // Use a database transaction for atomicity
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Deduct stock securely
    for (const item of validatedItems) {
      await Product.updateOne(
        { _id: item.product },
        { $inc: { stock: -item.quantity } },
        { session }
      );
    }

    // Create and save order
    const order = new Order({
      user: req.user._id,
      items: validatedItems,
      shippingDetails,
      paymentDetails: {
        method: paymentDetails.method,
        status: "Paid",
        transactionId: paymentDetails.transactionId,
      },
      totalAmount,
      discount: discount || {},
    });

    await order.save({ session });
    await addLogActivity(req.user._id, "New Order Created", {});

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Send confirmation email
    const populatedOrder = await Order.findById(order._id).populate(
      "items.product"
    );
    await sendNewOrderEmail(req.user.email, req.user.fullname, populatedOrder);

    return res
      .status(201)
      .json(new ApiResponse(201, order, "Order created successfully."));
  } catch (error) {
    // Rollback the transaction on error
    await session.abortTransaction();
    session.endSession();
    console.error("Order creation failed:", error);
    throw new ApiError(500, "Order creation failed. Please try again.");
  }
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
  const [totalOrders, totalDeliveredRevenue, totalUsers, totalProducts] =
    await Promise.all([
      // Total orders count
      Order.countDocuments(),

      // Total revenue for delivered orders
      Order.aggregate([
        {
          $match: {
            isDelivered: true, // Only include delivered orders
            orderStatus: "Delivered",
          },
        },
        {
          $group: {
            _id: null,
            revenue: { $sum: "$totalAmount" }, // Sum totalAmount for delivered orders
          },
        },
      ]),

      // Total users count
      User.countDocuments(),

      // Total products count
      Product.countDocuments(),
    ]);

  // Extract revenue from aggregation result
  const totalRevenue = totalDeliveredRevenue[0]?.revenue || 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalOrders,
        totalRevenue,
        totalUsers,
        totalProducts,
      },
      "Order stats fetched successfully."
    )
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
const getProductSoldData = asyncHandler(async (req, res) => {
  try {
    const { limit = 15, sort = -1 } = req.query;

    // Step 1: Fetch all categories
    const categories = await Category.find().lean();

    // Step 2: Fetch all orders
    const orders = await Order.find()
      .populate("items.product") // Populate product details in order items
      .lean();

    // Step 3: Calculate total sold for each category
    const categorySoldData = categories.map((category) => {
      // Initialize total sold for this category
      let totalSold = 0;

      // Iterate over orders to calculate sold quantities
      orders.forEach((order) => {
        order.items.forEach((item) => {
          if (
            item.product &&
            item.product.category.toString() === category?.name.toString() &&
            order?.isDelivered === true &&
            order?.orderStatus === "Delivered"
          ) {
            totalSold += item.quantity;
          }
        });
      });

      return {
        _id: category._id,
        name: category.name,
        totalSold,
      };
    });

    // Step 4: Sort and limit the result
    const sortedData = categorySoldData
      .sort((a, b) =>
        sort === -1 ? b.totalSold - a.totalSold : a.totalSold - b.totalSold
      )
      .slice(0, parseInt(limit, 10));

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          sortedData,
          "Product sold data fetched successfully."
        )
      );
  } catch (error) {
    console.error("Error fetching product sold data:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to fetch product sold data."));
  }
});
const getLastOrderByUser = asyncHandler(async (req, res) => {
  const { orderId } = req.query; // Check if orderId is provided in the query parameters

  let order;

  if (orderId) {
    // Fetch the specific order by orderId
    order = await Order.findOne({ _id: orderId, user: req?.user?._id })
      .populate("user", "fullname email") // Fetch user details
      .populate("items.product", "name price category brand images") // Fetch product details
      .lean();

    if (!order) {
      throw new ApiError(
        404,
        `Order with ID ${orderId} not found for this user.`
      );
    }
  } else {
    // Fetch the most recent order for the user
    order = await Order.findOne({ user: req?.user?._id })
      .sort({ createdAt: -1 }) // Sort in descending order (newest first)
      .populate("user", "fullname email") // Fetch user details
      .populate("items.product", "name price category brand images") // Fetch product details
      .lean();

    if (!order) {
      throw new ApiError(404, "No orders found for this user.");
    }
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        order,
        orderId
          ? `Order with ID ${orderId} fetched successfully.`
          : `Last order for user ${req?.user?._id} fetched successfully.`
      )
    );
});
// ✅ Get last 10 orders of a user with pagination
const getOrdersByUserFor10 = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Extract user ID from auth middleware
  let { page = 1, limit = 10 } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);

  // Count total orders
  const totalOrders = await Order.countDocuments({ user: userId });

  // Fetch orders sorted by latest
  const orders = await Order.find({ user: userId })
    .sort({ createdAt: -1 }) // Sort by newest first
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("user", "fullname email") // Fetch user details
    .populate("items.product", "name price category brand images") // Fetch product details
    .lean();

  if (!orders || orders.length === 0) {
    throw new ApiError(404, "No orders found for this user.");
  }

  const totalPages = Math.ceil(totalOrders / limit);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { orders, totalOrders, totalPages, currentPage: page },
        `Last ${limit} orders for user ${userId} fetched successfully.`
      )
    );
});

const SendEmailForPortfolio = asyncHandler(async (req, res) => {
  let { name, email, subject, message } = req.body;
  await sendContactEmail(name, email, subject, message);
  return res.status(200).json(new ApiResponse(200, "Email Send Successfully."));
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
  getProductSoldData,
  getLastOrderByUser,
  getOrdersByUserFor10,
  SendEmailForPortfolio,
};
