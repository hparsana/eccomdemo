import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const authMiddleWare = (allowedRoles = []) =>
  asyncHandler(async (req, _, next) => {
    try {
      // Retrieve token from cookies or Authorization header
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        throw new ApiError(401, "Access token is missing");
      }

      // Verify token
      if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new ApiError(500, "Server configuration error");
      }

      let isTokenDecode;
      try {
        isTokenDecode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      } catch (err) {
        throw new ApiError(401, "Invalid or expired access token");
      }

      // Ensure token contains the required payload
      if (!isTokenDecode?._id) {
        throw new ApiError(400, "Invalid token payload");
      }

      // Fetch user from the database
      const user = await User.findById(isTokenDecode._id).select(
        "-password -refreshToken"
      );

      if (!user) {
        throw new ApiError(404, "User not found");
      }

      // Check if user's role is allowed
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        throw new ApiError(403, "Access denied");
      }

      // Attach user to request object
      req.user = user;
      next();
    } catch (error) {
      console.error("Authentication error:", error.message); // Log for debugging
      throw new ApiError(
        error?.statusCode || 400,
        error?.message || "Authentication failed"
      );
    }
  });
