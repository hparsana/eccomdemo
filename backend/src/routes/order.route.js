import express from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { authMiddleWare } from "../middlewares/auth.middleware.js";
import {
  cancelOrderSchemaValidation,
  createOrderSchemaValidation,
  updateOrderSchemaValidation,
  updateAddressSchemaValidation,
} from "../utils/schemaValidation.js";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
  getOrdersByUser,
  getOrderStats,
  updateOrderAddress,
  getProductSoldData,
  getLastOrderByUser,
  getOrdersByUserFor10,
  SendEmailForPortfolio,
} from "../controllers/order.controller.js";

const routes = express.Router();

// Create a new order
routes.route("/createorder").post(
  authMiddleWare(["USER", "ADMIN"]), // Allow both users and admins
  validate(createOrderSchemaValidation),
  createOrder
);

// Get all orders with optional filters
routes.route("/getorders").post(authMiddleWare(["ADMIN"]), getOrders); // Only admins can view all orders

// Get all orders by a specific user
routes
  .route("/getuserorders/:userId")
  .get(authMiddleWare(["USER", "ADMIN"]), getOrdersByUser); // Allow both users and admins

// Get a specific order by ID
routes
  .route("/getoneorder/:id")
  .get(authMiddleWare(["USER", "ADMIN"]), getOrderById); // Allow both users and admins

// Update the status of an order
routes.route("/updateorderstatus/:id").put(
  authMiddleWare(["ADMIN"]), // Only admins can update order status
  validate(updateOrderSchemaValidation),
  updateOrderStatus
);

// Cancel an order
routes
  .route("/cancelorder/:id")
  .put(
    validate(cancelOrderSchemaValidation),
    authMiddleWare(["USER", "ADMIN"]),
    cancelOrder
  ); // Allow both users and admins to cancel orders

// Delete an order
routes.route("/deleteorder/:id").delete(authMiddleWare(["ADMIN"]), deleteOrder); // Only admins can delete orders

// Get order statistics (e.g., total orders, revenue, etc.)
routes.route("/orderstats").get(authMiddleWare(["ADMIN"]), getOrderStats); // Only admins can view statistics

routes.route("/productsold").get(authMiddleWare(["ADMIN"]), getProductSoldData);
routes
  .route("/getlastorderbyuserid")
  .get(authMiddleWare(["ADMIN", "USER"]), getLastOrderByUser);

routes
  .route("/getlast10ordersbyuser")
  .get(authMiddleWare(["ADMIN", "USER"]), getOrdersByUserFor10);

routes
  .route("/updateaddress/:id")
  .put(
    authMiddleWare(["USER"]),
    validate(updateAddressSchemaValidation),
    updateOrderAddress
  );
routes.route("/sendemailforportfolio").post(SendEmailForPortfolio);

export default routes;
