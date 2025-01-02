"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCreditCard, FaPaypal, FaApplePay } from "react-icons/fa";

const PaymentPage = ({ isProductSummarySelected }) => {
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const router = useRouter();

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({ ...cardDetails, [name]: value });
  };

  const handlePayment = () => {
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    if (
      paymentMethod === "creditCard" &&
      (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv)
    ) {
      alert("Please fill in your card details");
      return;
    }

    // Proceed to order summary or confirmation
    router.push("/order-summary");
  };

  return (
    <div className="p-6 h-auto  flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Payment</h2>

        {/* Payment Options */}
        <div className="space-y-6">
          {/* Credit Card Option */}
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="creditCard"
              checked={paymentMethod === "creditCard"}
              onChange={() => setPaymentMethod("creditCard")}
              className="mr-3 accent-blue-500"
            />
            <div className="flex items-center space-x-3">
              <FaCreditCard className="text-blue-500 text-xl" />
              <span>Credit Card</span>
            </div>
          </label>

          {/* Debit Card Option */}
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="debitCard"
              checked={paymentMethod === "debitCard"}
              onChange={() => setPaymentMethod("debitCard")}
              className="mr-3 accent-blue-500"
            />
            <div className="flex items-center space-x-3">
              <FaCreditCard className="text-green-500 text-xl" />
              <span>Debit Card</span>
            </div>
          </label>

          {/* Online Payment Option */}
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              checked={paymentMethod === "paypal"}
              onChange={() => setPaymentMethod("paypal")}
              className="mr-3 accent-blue-500"
            />
            <div className="flex items-center space-x-3">
              <FaPaypal className="text-blue-600 text-xl" />
              <span>PayPal</span>
            </div>
          </label>

          {/* Apple Pay Option */}
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="applePay"
              checked={paymentMethod === "applePay"}
              onChange={() => setPaymentMethod("applePay")}
              className="mr-3 accent-blue-500"
            />
            <div className="flex items-center space-x-3">
              <FaApplePay className="text-black text-xl" />
              <span>Apple Pay</span>
            </div>
          </label>
        </div>

        {/* Card Details Input */}
        {paymentMethod === "creditCard" || paymentMethod === "debitCard" ? (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Enter Card Details
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                maxLength="16"
                value={cardDetails.cardNumber}
                onChange={handleCardChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex space-x-4">
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="MM/YY"
                  maxLength="5"
                  value={cardDetails.expiryDate}
                  onChange={handleCardChange}
                  className="w-1/2 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  maxLength="3"
                  value={cardDetails.cvv}
                  onChange={handleCardChange}
                  className="w-1/2 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        ) : null}

        {/* Proceed Button */}
        <button
          className="mt-8 w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 font-bold"
          onClick={handlePayment}
        >
          Proceed to Order Summary
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
