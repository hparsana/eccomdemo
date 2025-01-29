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
} from "@mui/material";

const StripeCheckout = ({ onPaymentSuccess, chnageLoadingStatus, loading }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false); // State for confirmation modal
  const [isFormComplete, setIsFormComplete] = useState(false); // Track form completion

  // Check form validity
  useEffect(() => {
    if (!elements) return;

    const paymentElement = elements.getElement(PaymentElement);

    if (paymentElement) {
      paymentElement.on("change", (event) => {
        setIsFormComplete(event.complete);
      });
    }
  }, [elements]);

  const handleOpenModal = () => {
    if (!isFormComplete) {
      setError("Please complete the payment form before proceeding.");
      return;
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleConfirmPayment = async () => {
    setOpenModal(false); // Close the modal
    chnageLoadingStatus(true);
    setError(null);

    if (!stripe || !elements) {
      return;
    }

    try {
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
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
      chnageLoadingStatus(false);
    }
    // finally {
    //   chnageLoadingStatus(false);
    // }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      {/* Payment Element for Stripe */}
      <PaymentElement className="p-3 border rounded-lg bg-white" />

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* Pay Now Button - Opens Confirmation Modal */}
      <button
        type="button"
        disabled={!stripe || loading}
        onClick={handleOpenModal}
        className={`mt-4 w-full py-2 rounded-lg ${
          isFormComplete
            ? "bg-blue-500 text-white"
            : "bg-gray-300 text-gray-600 cursor-not-allowed"
        }`}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>

      {/* Payment Confirmation Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        className=" rounded-lg "
      >
        <DialogTitle className="dark:text-white dark:bg-gray-800">
          Confirm Payment
        </DialogTitle>
        <DialogContent>
          <p className="pt-5 ">
            Are you sure you want to proceed with the payment?
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="error">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmPayment}
            color="primary"
            variant="contained"
          >
            Confirm & Pay
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StripeCheckout;
