import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import session from "express-session";
import { ApiError } from "./utils/ApiError.js";
import ErrorLog from "./models/errorLog.model.js";
import logger from "./utils/logger.js"; // Import Winston logger
import userRoutes from "./routes/user.route.js";
import productRoutes from "./routes/product.route.js";
import reviewRoutes from "./routes/review.route.js";
import orderRoutes from "./routes/order.route.js";
import saveProductRoutes from "./routes/savedProduct.route.js";
import categoryRoutes from "./routes/category.route.js";
import errorRoutes from "./routes/errorLog.route.js";

const app = express();

// Middleware Setup
app.use(cors({ origin: true, credentials: true }));
app.options("*", cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    name: "clone_app",
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/", (req, res) => {
  res.json("API is working perfectly. This is just for testing purposes.");
});
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/product", reviewRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/savedproduct", saveProductRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/errorlogs", errorRoutes);

// Catch-All for Undefined Routes
app.use((req, res, next) => {
  const error = new ApiError(404, "Route not found");
  next(error);
});

// Error Logging and Handling Middleware
app.use(async (err, req, res, next) => {
  const isCritical = err.statusCode >= 500 || !err.statusCode;

  // Log Critical Errors with Winston
  if (isCritical) {
    logger.error({
      message: err.message,
      stack: err.stack,
      method: req.method,
      route: req.originalUrl,
      additionalInfo: req.body || {},
    });

    // Log Critical Errors to MongoDB
    try {
      await ErrorLog.create({
        message: err.message,
        stack: err.stack,
        statusCode: err.statusCode || 500,
        method: req.method,
        route: req.originalUrl,
        additionalInfo: req.body || {},
      });
    } catch (logError) {
      logger.error({
        message: "Failed to log critical error to MongoDB",
        stack: logError.stack,
      });
    }
  }

  // Log All Errors in Development Mode
  if (process.env.NODE_ENV === "development") {
    console.error("Error:", err);
  }

  // Send Error Response
  const statusCode = err.statusCode || 500;
  const response = {
    statusCode,
    message: err.message || "Internal Server Error",
    success: false,
  };

  // Hide stack trace in production
  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
});

export default app;
