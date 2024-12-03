import express from "express";
import { validate } from "../middlewares/validate.middleware.js";
import {
  addReviewSchemaValidation,
  updateReviewSchemaValidation,
} from "../utils/schemaValidation.js";
import { authMiddleWare } from "../middlewares/auth.middleware.js";
import {
  addReview,
  deleteReview,
  getReviews,
  updateReview,
} from "../controllers/review.controller.js";

const routes = express.Router();

routes
  .route("/reviews/:productId")
  .post(
    validate(addReviewSchemaValidation),
    authMiddleWare(["USER", "ADMIN"]),
    addReview
  )
  .get(getReviews);

routes
  .route("/:productId/reviews/:reviewId")
  .put(
    validate(updateReviewSchemaValidation),
    authMiddleWare(["USER", "ADMIN"]),
    updateReview
  )
  .delete(authMiddleWare(["USER", "ADMIN"]), deleteReview);

export default routes;
