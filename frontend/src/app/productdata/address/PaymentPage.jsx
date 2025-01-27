"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripeCheckout from "@/app/components/payment/StripeCheckout";
import { LOCAL_PATH } from "@/app/utils/constant";
import { useSelector, useDispatch } from "react-redux";
import { addOrder, getLastOrderByUserId } from "@/app/store/Order/orderApi";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const PaymentPage = () => {
  const [clientSecret, setClientSecret] = useState("");
  const { cartItems } = useSelector((state) => state.cartData);
  const { selectedAddress } = useSelector((state) => state.addressData);
  const { lastOrder } = useSelector((state) => state.orderData);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter(); // ✅ Use Next.js router for navigation

  const calculateTotal = () => {
    const totalPrice = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const totalOriginalPrice = cartItems.reduce(
      (total, item) => total + item.originalPrice * item.quantity,
      0
    );
    const discount = totalOriginalPrice - totalPrice;

    return {
      totalPrice,
      discount,
      deliveryCharge: totalPrice > 5000 ? 0 : 99,
      totalAmount: totalPrice + (totalPrice > 5000 ? 0 : 99),
    };
  };
  useEffect(() => {
    dispatch(getLastOrderByUserId());
  }, []);
  useEffect(() => {
    const totalInfo = calculateTotal(); // Calculate total before making request
    const userToken = localStorage.getItem("accessToken");

    // Convert INR to paise (smallest unit)
    const totalAmountInPaise = Math.round(totalInfo.totalAmount * 100);

    fetch(`${LOCAL_PATH}/payment/create-payment-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({ amount: totalAmountInPaise, currency: "inr" }), // ✅ Fixed conversion
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
      .catch((error) => console.error("Error fetching payment intent:", error));
  }, []);

  const totalInfo = calculateTotal();
  const chnageLoadingStatus = (value) => {
    setLoading(Boolean(value));
  };
  const onPaymentSuccess = async (data) => {
    console.log("Payment succeeded:", data);

    // Create order data for API
    const orderData = {
      items: cartItems?.map((item) => ({
        product: item.id, // Product ID
        quantity: item.quantity,
        price: item.price,
        color: item.color,
      })),
      shippingDetails: {
        address: `Name: ${selectedAddress?.fullName} \n ${selectedAddress?.addressLine1} \n ${selectedAddress?.addressLine2} \n phone-No:${selectedAddress?.phone}`,
        city: `${selectedAddress?.city}`,
        state: `${selectedAddress?.state}`,
        postalCode: `${selectedAddress?.postalCode}`,
        country: `${selectedAddress?.country}`,
      },
      paymentDetails: {
        method: data?.payment_method_types?.[0] || "Unknown",
        status: "Paid",
        transactionId: data?.id || "N/A", // Payment Intent ID from Stripe
      },
      discount: {
        percentage: totalInfo.totalOriginalPrice
          ? parseFloat(
              (
                (totalInfo.discount / totalInfo.totalOriginalPrice) *
                100
              ).toFixed(2)
            ) || 0
          : 0,
        amount: parseFloat(totalInfo.discount) || 0,
      },
    };

    try {
      const response = await dispatch(addOrder(orderData)).unwrap();
      console.log(
        "Order created successfully:",
        response,
        response?.user &&
          response?.totalAmount &&
          response?.createdAt &&
          response?.orderStatus === "Pending"
      );
      if (
        response?.user &&
        response?.totalAmount &&
        response?.createdAt &&
        response?.orderStatus === "Pending"
      ) {
        console.log("jenish coem here<<<<<<<<");

        chnageLoadingStatus(false);
        router.push("/productdata/order-success"); //
      }
    } catch (error) {
      console.error("Order creation failed:", error);
      chnageLoadingStatus(false);
    }
  };

  return (
    <div className="p-6 h-auto flex items-center justify-center bg-gray-50 dark:bg-gray-800">
      <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">Payment</h2>
        {clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <StripeCheckout
              onPaymentSuccess={onPaymentSuccess}
              loading={loading}
              chnageLoadingStatus={chnageLoadingStatus}
            />
          </Elements>
        ) : (
          <p className="dark:text-white">Loading payment details...</p>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
