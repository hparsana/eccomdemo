import Stripe from "stripe";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import crypto from "crypto";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const PaymentController = {
  // ✅ 1️⃣ Create Payment Intent
  async createPaymentIntent(req, res) {
    try {
      const { amount, currency, metadata } = req.body;

      if (!amount || amount < 100) {
        return res.status(400).json({ error: "Invalid payment amount" });
      }

      if (
        !metadata ||
        !metadata.userId ||
        !metadata.cartItems ||
        !metadata.shippingDetails
      ) {
        return res
          .status(400)
          .json({ error: "Missing required fields in metadata" });
      }

      const { userId, cartItems, shippingDetails } = metadata;

      // ✅ Parse cartItems JSON string into an array
      let parsedCartItems;
      try {
        parsedCartItems = JSON.parse(cartItems);
      } catch (err) {
        return res.status(400).json({ error: "Invalid cartItems format" });
      }

      if (!Array.isArray(parsedCartItems)) {
        return res.status(400).json({ error: "cartItems should be an array" });
      }

      // ✅ Only store essential details to avoid exceeding the 500-character limit
      const productIds = parsedCartItems.map((item) => item.id); // Store only product IDs
      const addressDatas = JSON.parse(shippingDetails);
      const shippingAddressId = addressDatas._id; // Store only address ID

      const idempotencyKey = `${userId}-${Date.now()}`; // Prevents duplicate charges

      const paymentIntent = await stripe.paymentIntents.create(
        {
          amount,
          currency,
          payment_method_types: ["card"],
          metadata: {
            userId,
            productIds: JSON.stringify(productIds), // ✅ Store only product IDs
            shippingAddressId, // ✅ Store only the shipping address ID
          },
        },
        { idempotencyKey }
      );

      return res.status(200).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    } catch (error) {
      console.error("❌ Payment Intent Creation Failed:", error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  // ✅ 2️⃣ Confirm Payment after User Submission
  async confirmPayment(req, res) {
    try {
      const { paymentIntentId } = req.body;

      if (!paymentIntentId) {
        return res
          .status(400)
          .json({ success: false, message: "PaymentIntent ID is required" });
      }

      // Fetch existing payment intent
      const existingIntent =
        await stripe.paymentIntents.retrieve(paymentIntentId);

      if (existingIntent.status === "succeeded") {
        return res.status(200).json({
          success: true,
          message: "Payment already confirmed",
          paymentIntent: existingIntent,
        });
      }

      // Confirm payment intent
      const paymentIntent =
        await stripe.paymentIntents.confirm(paymentIntentId);

      return res.status(200).json({ success: true, paymentIntent });
    } catch (error) {
      console.error("❌ Payment Confirmation Failed:", error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export async function handleStripeWebhook(req, res) {
  try {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("❌ Webhook Signature Verification Failed:", err.message);
      return res.status(400).send(`Webhook Signature Error: ${err.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      console.log("💰 Payment Succeeded:", paymentIntent);

      let { userId, productIds, shippingAddressId } = paymentIntent.metadata;

      // ✅ Ensure required metadata fields exist
      if (!userId || !productIds || !shippingAddressId) {
        console.error("❌ Missing required metadata in paymentIntent!");
        return res
          .status(400)
          .json({ success: false, message: "Missing payment metadata" });
      }

      // ✅ Parse product IDs properly
      let parsedProductIds;
      try {
        parsedProductIds = JSON.parse(productIds);
        if (!Array.isArray(parsedProductIds) || parsedProductIds.length === 0) {
          throw new Error("Invalid productIds format");
        }
      } catch (err) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid productIds format" });
      }

      // ✅ Check if order already exists
      const existingOrder = await Order.findOne({
        transactionId: paymentIntent.id,
      });
      if (existingOrder) {
        console.log("⚠️ Order already exists for this payment");
        return res
          .status(200)
          .json({ success: true, message: "Order already exists" });
      }

      // ✅ Use a transaction for stock deduction and order creation
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        let totalAmount = 0;
        const validatedItems = [];

        for (const productId of parsedProductIds) {
          // ✅ Ensure product exists and has enough stock
          const product = await Product.findById(productId).session(session);
          if (!product || product.stock < 1) {
            throw new ApiError(
              400,
              `Product with ID ${productId} is out of stock`
            );
          }

          const itemTotal = product.price;
          totalAmount += itemTotal;

          validatedItems.push({
            product: product._id,
            quantity: 1, // Since productId list doesn't have quantity, assume 1
            price: product.price,
          });

          // ✅ Deduct stock securely
          await Product.updateOne(
            { _id: product._id },
            { $inc: { stock: -1 } }, // Decrease stock by 1 for each product
            { session }
          );
        }

        // ✅ Ensure payment amount matches expected total
        if (totalAmount !== paymentIntent.amount / 100) {
          throw new ApiError(400, "Payment amount mismatch");
        }

        // ✅ Create order
        const newOrder = new Order({
          user: userId,
          items: validatedItems,
          shippingDetails: shippingAddressId, // Save only the shipping address ID
          totalAmount,
          paymentDetails: {
            method: paymentIntent.payment_method_types[0] || "Unknown",
            status: "Paid",
            transactionId: paymentIntent.id,
          },
          orderStatus: "Processing",
        });

        await newOrder.save({ session });

        // ✅ Commit transaction
        await session.commitTransaction();
        session.endSession();

        console.log("✅ Order Created:", newOrder);
        return res.status(200).json({
          success: true,
          message: "Order created successfully",
          order: newOrder,
        });
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("❌ Order Creation Failed:", error);
        return res
          .status(500)
          .json({ success: false, message: "Order creation failed." });
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook Error:", error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
}

export const getPaymentInfo = asyncHandler(async (req, res) => {
  const { transactionId } = req.params;

  if (!transactionId) {
    throw new ApiError(400, "Transaction ID is required.");
  }

  try {
    // Retrieve payment intent details from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(transactionId);

    if (!paymentIntent) {
      throw new ApiError(404, "Payment details not found.");
    }

    // Securely return payment details
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          id: paymentIntent.id,
          amount: paymentIntent.amount / 100, // Convert from cents
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          payment_method_types: paymentIntent.payment_method_types,
          created_at: new Date(paymentIntent.created * 1000), // Convert Unix timestamp
        },
        "Payment details fetched successfully."
      )
    );
  } catch (error) {
    console.error("Error fetching payment details:", error);
    throw new ApiError(500, "Failed to retrieve payment details.");
  }
});
