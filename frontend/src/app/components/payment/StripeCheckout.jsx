import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";

const StripeCheckout = ({ onPaymentSuccess, chnageLoadingStatus, loading }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    chnageLoadingStatus(true);
    setError(null);

    if (!stripe || !elements) {
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-summary`,
      },
      redirect: "if_required",
    });

    if (error) {
      console.error("Payment failed:", error);
      setError(
        "Payment could not be processed. Please try again or contact support."
      );
      chnageLoadingStatus(false);
    } else {
      onPaymentSuccess(paymentIntent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded-lg">
      {/* PaymentElement will dynamically show Cards, UPI, NetBanking, etc. */}
      <PaymentElement className="p-3 border rounded-lg bg-white" />
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

export default StripeCheckout;
