"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLastOrdersByUserId } from "../store/Order/orderApi";
import {
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  Typography,
  styled,
  useMediaQuery,
} from "@mui/material";
import {
  FaBoxOpen,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaStar,
  FaDownload,
} from "react-icons/fa";
import Image from "next/image";
import { downloadInvoicePDF } from "./downloadInvoice";
import { addDays, format } from "date-fns";
import ReviewModal from "../components/dialoge/ReviewModal";
import { redirect } from "next/navigation";

// Order Status Steps
const OrderStatusSteps = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  // "Cancelled",
];

// Icons for Each Step
const StatusIcons = {
  Pending: () => <FaSpinner className="text-yellow-500" />,
  Processing: () => <FaTruck className="text-pink-500" />,
  Shipped: () => <FaBoxOpen className="text-purple-500" />,
  Delivered: () => <FaCheckCircle className="text-green-500" />,
  Cancelled: () => <FaTimesCircle className="text-red-500" />,
};

const getStepDates = (
  createdAt,
  isProcessingAt,
  isShippedAt,
  deliveredAt,
  orderStatus
) => {
  const createdDate = new Date(createdAt);
  const processDate = isProcessingAt ? new Date(isProcessingAt) : null;
  const shippedDate = isShippedAt ? new Date(isShippedAt) : null;
  const deliveredDate = deliveredAt ? new Date(deliveredAt) : null;
  const today = new Date();

  // Define expected delays for each step (in days)
  const expectedProcessingDelay = 1; // Processing after 1 day
  const expectedShippingDelay = 3; // Shipping after 3 days
  const expectedDeliveryDelay = 5; // Delivery after 5 days

  // Calculate expected dates based on available data
  const expectedProcessDate =
    processDate || addDays(createdDate, expectedProcessingDelay);
  const expectedShippedDate =
    shippedDate ||
    addDays(
      expectedProcessDate,
      expectedShippingDelay - expectedProcessingDelay
    );
  const expectedDeliveredDate =
    deliveredDate ||
    addDays(expectedShippedDate, expectedDeliveryDelay - expectedShippingDelay);

  // Ensure future steps have expected dates if they are not completed
  const steps = {
    Pending: `Order Placed on ${format(createdDate, "dd MMM yyyy")}`,
    Processing: processDate
      ? `Packed on ${format(processDate, "dd MMM yyyy")}`
      : orderStatus !== "Pending"
        ? `Expected by ${format(expectedProcessDate, "dd MMM yyyy")}`
        : `Expected by ${format(expectedProcessDate, "dd MMM yyyy")}`,
    Shipped: shippedDate
      ? `Shipped on ${format(shippedDate, "dd MMM yyyy")}`
      : orderStatus === "Delivered" || orderStatus === "Processing"
        ? `Expected by ${format(expectedShippedDate, "dd MMM yyyy")}`
        : `Expected by ${format(expectedShippedDate, "dd MMM yyyy")}`,
    Delivered: deliveredDate
      ? `Delivered on ${format(deliveredDate, "dd MMM yyyy")}`
      : orderStatus === "Shipped" || orderStatus === "Processing"
        ? `Expected by ${format(expectedDeliveredDate, "dd MMM yyyy")}`
        : `Expected by ${format(expectedDeliveredDate, "dd MMM yyyy")}`,
  };

  // Remove future step dates if they haven't reached that step yet
  // const statusIndex = OrderStatusSteps.indexOf(orderStatus);
  // Object.keys(steps).forEach((step, index) => {
  //   if (index > statusIndex) {
  //     steps[step] = ""; // Remove future dates
  //   }
  // });

  return steps;
};

// Custom Step Icon Component
const CustomStepIcon = (props) => {
  const { active, completed, icon } = props;
  const IconComponent = StatusIcons[OrderStatusSteps[icon - 1]];
  return (
    <div
      className={`w-10 h-10 flex items-center justify-center rounded-full ${
        completed
          ? "bg-green-900 text-white"
          : active
            ? "bg-blue-500 text-white"
            : "bg-gray-300 text-gray-500"
      }`}
    >
      <IconComponent />
    </div>
  );
};

// Custom Step Connector to Color the Row Line
const CustomStepConnector = styled(StepConnector)(({ theme, orientation }) => ({
  [`& .MuiStepConnector-line`]: {
    height: orientation === "vertical" ? "100%" : 3, // Full height for vertical, 3px for horizontal
    width: orientation === "vertical" ? 3 : "100%", // Full width for horizontal, 3px for vertical
    border: 0,
    backgroundColor: theme.palette.mode === "dark" ? "#555" : "#ccc",
    transition: "background-color 0.3s ease-in-out",
    marginTop: orientation === "vertical" ? 0 : 7, // Adjust margin for alignment
    marginLeft: orientation === "vertical" ? 7 : 0, // Adjust margin for alignment
  },
  [`&.Mui-completed .MuiStepConnector-line`]: {
    backgroundColor: "green",
  },
  [`&.Mui-active .MuiStepConnector-line`]: {
    backgroundColor: "green",
  },
}));

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { lastOrders, loading, error } = useSelector(
    (state) => state.orderData
  );
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [productId, setProductId] = useState(false);

  const [openOrderId, setOpenOrderId] = useState(null);
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    dispatch(getLastOrdersByUserId({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleAddReview = (productId) => {
    setProductId(productId);
    setReviewModalOpen(true);
  };
  const handleCardClick = (id) => {
    redirect(`/productdata/${id}`);
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">
          Loading your orders...
        </p>
      </div>
    );
  }

  if (error || lastOrders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-red-500">No recent orders found.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto p-6 pb-20 text-gray-900 dark:text-white">
        <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
        <div className="space-y-6">
          {lastOrders.map((order) => {
            const currentStepIndex = OrderStatusSteps.indexOf(
              order.orderStatus
            );
            const isDelivered = order.orderStatus === "Delivered";

            return (
              <div
                key={order._id}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                {/* Order Header */}
                <div
                  className="cursor-pointer flex justify-between items-center"
                  onClick={() =>
                    setOpenOrderId(openOrderId === order._id ? null : order._id)
                  }
                >
                  <div>
                    <p className="sm:text-lg text-sm font-semibold">
                      Order ID:{" "}
                      <span className="hidden sm:inline">{order._id}</span>
                      <span className="sm:hidden">
                        {order._id.slice(0, 22)}...
                      </span>
                    </p>
                    <p className="text-gray-500 sm:text-lg text-sm dark:text-gray-400">
                      Total: ₹{order.totalAmount}
                    </p>
                    <p className="text-gray-500 sm:text-lg text-sm dark:text-gray-400">
                      Ordered on{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-center flex flex-col justify-center items-center">
                    <span className="text-xl">
                      {StatusIcons[order.orderStatus]()}
                    </span>
                    <p className="mt-2">{order.orderStatus}</p>
                  </div>
                </div>

                {/* Accordion - Order Details */}
                {openOrderId === order._id && (
                  <div className="mt-4 border-t pt-4">
                    {/* Order Progress Bar */}
                    <div className="w-full flex flex-col items-center p-4">
                      <Stepper
                        orientation={isSmallScreen ? "vertical" : "horizontal"}
                        activeStep={currentStepIndex}
                        connector={
                          <CustomStepConnector
                            orientation={
                              isSmallScreen ? "vertical" : "horizontal"
                            }
                          />
                        }
                        className="w-full"
                      >
                        {OrderStatusSteps.map((step, index) => (
                          <Step
                            key={index}
                            completed={currentStepIndex > index}
                            disabled={isDelivered}
                          >
                            <StepLabel StepIconComponent={CustomStepIcon}>
                              <Typography
                                sx={{
                                  color:
                                    currentStepIndex >= index
                                      ? "green"
                                      : "gray",
                                  fontWeight: "bold",
                                  fontSize: "14px",
                                }}
                              >
                                {step}
                              </Typography>
                              <Typography
                                sx={{ fontSize: "12px", color: "gray" }}
                              >
                                {getStepDates(
                                  order.createdAt,
                                  order?.isProcessingAt,
                                  order?.isShippedAt,
                                  order?.deliveredAt,

                                  order.orderStatus
                                )[step] || ""}
                              </Typography>
                            </StepLabel>
                          </Step>
                        ))}
                      </Stepper>
                    </div>
                    {isDelivered && (
                      <div className="flex justify-center items-center md:my-4 my-3">
                        <FaCheckCircle size={40} className="text-green-500" />{" "}
                        <h2 className="px-2">
                          Your order has been successfully Delivered
                        </h2>
                      </div>
                    )}
                    {/* Order Items */}
                    <h3 className="text-lg font-semibold mt-4">Items</h3>
                    <div className="mt-2 p-1 border-[1px] space-y-2">
                      {order.items.map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center flex-wrap justify-between border-b pb-2"
                        >
                          <div className="flex items-center">
                            <Image
                              src={
                                item?.product?.images?.[0]?.url ||
                                "/placeholder.png"
                              }
                              alt={item?.product?.name || "Product Image"}
                              width={106}
                              height={106}
                              className="rounded-lg object-cover cursor-pointer"
                              priority
                              onClick={() => handleCardClick(item.product?._id)}
                            />
                            <div className="ml-5">
                              <p className="text-gray-900 dark:text-gray-200 font-semibold">
                                {item.product.name}
                              </p>
                              <p className="text-gray-700 dark:text-gray-400 text-sm">
                                {item.product.brand} - {item.product.category}
                              </p>
                            </div>
                          </div>
                          <div className="mt-5 mr-5 md:text-end">
                            <p className="text-gray-700 dark:text-gray-400">
                              <strong>Color:</strong> {item.color}
                            </p>
                            <p className="text-gray-700 dark:text-gray-400">
                              <strong>Qty:</strong> {item.quantity}
                            </p>
                            <p className="text-gray-700 dark:text-gray-400">
                              <strong>Price:</strong> ₹{item.price}
                            </p>
                            {isDelivered && (
                              <button
                                className="px-2 py-2 mt-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 text-[13px] transition duration-300 ease-in-out transform hover:scale-105"
                                onClick={() =>
                                  handleAddReview(item.product?._id)
                                }
                              >
                                Give Review
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Extra Content for Delivered Orders */}
                    {isDelivered && (
                      <div className="mt-6 flex flex-col sm:flex-row gap-4">
                        {/* <button className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                          <FaStar /> Rate Product
                        </button> */}
                        <button
                          className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                          onClick={() => downloadInvoicePDF(order)}
                        >
                          <FaDownload /> Download Invoice
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* Review Modal */}
      <ReviewModal
        open={isReviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        productId={productId}
      />
    </div>
  );
};

export default OrdersPage;
