"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripeCheckout from "@/app/components/payment/StripeCheckout";
import { LOCAL_PATH } from "@/app/utils/constant";

const stripePromise = loadStripe(
  "pk_test_51QkOJCBTZwDIXAx1sodxkOsyiEkIJIr3UJs2Pbp0LLz0kdSUKhY6PX7bpkw0pWaM8GDtn8NfG2pqijY5hgzA73EP00RLlhTzHA"
);

const PaymentPage = () => {
  const [clientSecret, setClientSecret] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Fetch clientSecret from backend when page loads
    fetch(`${LOCAL_PATH}/payment/create-payment-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 1000, currency: "usd" }), // Modify as needed
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  return (
    <div className="p-6 h-auto flex items-center justify-center bg-gray-50 dark:bg-gray-800">
      <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">Payment</h2>
        {clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <StripeCheckout />
          </Elements>
        ) : (
          <p className="dark:text-white ">Loading payment details...</p>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
