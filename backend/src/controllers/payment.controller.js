import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const PaymentController = {
  // ✅ 1️⃣ Create a Stripe Payment Intent
  async createPaymentIntent(req, res) {
    try {
      const { amount, currency } = req.body; // Amount in smallest unit (₹10 = 1000)

      // Create a PaymentIntent (required for clientSecret)
      const paymentIntent = await stripe.paymentIntents.create({
        amount, // Amount in cents
        currency, // Use "inr" for UPI payments in India
        payment_method_types: ["card"], // Enable Cards, UPI, and NetBanking
      });

      // Send clientSecret to the frontend
      return res
        .status(200)
        .json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // ✅ 2️⃣ Confirm Payment after user submits details
  async confirmPayment(req, res) {
    try {
      const { paymentIntentId } = req.body;

      // Confirm payment intent
      const paymentIntent =
        await stripe.paymentIntents.confirm(paymentIntentId);

      return res.status(200).json({ success: true, paymentIntent });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // ✅ 3️⃣ Handle Payment Webhooks (for success/failure updates)
  async handleStripeWebhook(req, res) {
    try {
      const sig = req.headers["stripe-signature"];
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      if (event.type === "payment_intent.succeeded") {
        console.log("💰 Payment succeeded:", event.data.object);
      } else if (event.type === "payment_intent.payment_failed") {
        console.log("❌ Payment failed:", event.data.object);
      }

      res.json({ received: true });
    } catch (error) {
      console.error("Webhook error:", error.message);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  },
};
