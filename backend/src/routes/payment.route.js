import express from "express";
import { authMiddleWare } from "../middlewares/auth.middleware.js";
import { PaymentController } from "../controllers/payment.controller.js";

const router = express.Router();

// ✅ Create a Payment Intent (Generates `clientSecret` for frontend)
router.post(
  "/create-payment-intent",
  // authMiddleWare(["USER", "ADMIN"]),
  PaymentController.createPaymentIntent
);

// ✅ Confirm Payment after user submits details
router.post(
  "/confirm-payment",
  authMiddleWare(["USER", "ADMIN"]),
  PaymentController.confirmPayment
);

// ✅ Handle Payment Webhooks (Stripe sends updates here)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }), // Required for Stripe webhook
  PaymentController.handleStripeWebhook
);

export default router;
