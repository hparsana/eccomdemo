import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { FaCheckCircle, FaCreditCard } from "react-icons/fa";

const StripeCheckout = ({ onPaymentSuccess, chnageLoadingStatus, loading }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false); // ✅ Modal state
  const [activeStep, setActiveStep] = useState(0); // ✅ Stepper state
  const [isFormValid, setIsFormValid] = useState(false);

  // Check form validity
  useEffect(() => {
    if (!elements) return;
    const paymentElement = elements.getElement(PaymentElement);

    if (paymentElement) {
      paymentElement.on("change", (event) => {
        setIsFormValid(event.complete); // Update validity based on event
      });
    }
  }, [elements]);

  const handleOpenModal = () => {
    setOpenModal(true);
    setActiveStep(0); // Reset stepper
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleConfirmPayment = async () => {
    if (!stripe || !elements) return;
    setError(null);
    setActiveStep(1); // ✅ Show "Processing Payment..."
    chnageLoadingStatus(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-summary`,
        },
        redirect: "if_required",
      });

      if (error) {
        // console.error("Payment failed:", error.message);
        setError(
          error.message || "Payment could not be processed. Please try again."
        );
        handleCloseModal();

        chnageLoadingStatus(false);
        setActiveStep(0);
      } else {
        onPaymentSuccess(paymentIntent);
        setActiveStep(2); // ✅ Show "Creating Order..."
      }
    } catch (err) {
      // console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
      chnageLoadingStatus(false);
      handleCloseModal();
      setActiveStep(0);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      {/* Payment Form */}
      <PaymentElement className="p-3 border rounded-lg bg-white" />
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* Pay Now Button - Opens Modal */}
      <button
        type="button"
        disabled={!stripe || loading || !isFormValid} // Disable button if form is not valid
        onClick={handleOpenModal}
        className={`mt-4 w-full py-2 rounded-lg ${
          loading || !isFormValid
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 text-white"
        }`}
      >
        {loading ? "Processing Payment..." : "Pay Now"}
      </button>

      {/* Payment Processing Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        {/* Dialog Container */}
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          {/* Dialog Box */}
          <div className="w-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            {/* Dialog Title */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Payment Progress
              </h2>
            </div>

            {/* Dialog Content */}
            <div className="p-6">
              {/* Stepper UI */}
              <div className="flex justify-center gap-x-20 items-center relative">
                {/* Progress Line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 -z-10"></div>
                <div
                  className="absolute top-24 left-0 h-1 bg-blue-500 dark:bg-blue-700 transition-all duration-500"
                  style={{
                    width: `${(activeStep / 2) * 100}%`,
                  }}
                ></div>

                {/* Step 1: Processing Payment */}
                <div className="flex flex-col  items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      activeStep >= 0
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                    }`}
                  >
                    {activeStep > 0 ? (
                      <FaCheckCircle className="text-xl" />
                    ) : (
                      <FaCreditCard className="text-xl" />
                    )}
                  </div>
                  <span
                    className={`mt-4 text-sm font-medium ${
                      activeStep >= 0
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    Processing Payment
                  </span>
                </div>

                {/* Step 2: Creating Order */}
                <div className="flex flex-col  justify-center items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      activeStep >= 1
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                    }`}
                  >
                    <FaCheckCircle className="text-xl" />
                  </div>
                  <span
                    className={`mt-4 text-sm font-medium ${
                      activeStep >= 1
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    Creating Order
                  </span>
                </div>
              </div>

              {/* Message Box */}
              <div className="mt-8 text-center">
                {activeStep === 0 && (
                  <p className="text-gray-600 dark:text-gray-400">
                    Awaiting Payment...
                  </p>
                )}
                {activeStep === 1 && (
                  <p className="text-blue-600 dark:text-blue-400">
                    Processing Payment...
                  </p>
                )}
                {activeStep === 2 && (
                  <p className="text-green-600 dark:text-green-400">
                    Order is being created...
                  </p>
                )}
              </div>
            </div>

            {/* Dialog Actions (Buttons) */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-4">
              <button
                onClick={handleCloseModal}
                disabled={activeStep > 0}
                className={`px-6 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  activeStep > 0
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-500 "
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
              >
                Close
              </button>
              <button
                onClick={handleConfirmPayment}
                disabled={activeStep > 0}
                className={`px-6 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  activeStep > 0
                    ? "bg-blue-200 dark:bg-blue-700 text-blue-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {activeStep === 0 ? "Confirm & Pay" : "Processing..."}
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default StripeCheckout;
