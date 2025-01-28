"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLastOrdersByUserId } from "../store/Order/orderApi";
import {
  Stepper,
  Step,
  StepLabel,
  StepIconProps,
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
} from "react-icons/fa";
import Image from "next/image";

// Order Status Steps
const OrderStatusSteps = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

// Icons for Each Step
const StatusIcons = {
  Pending: FaSpinner,
  Processing: FaTruck,
  Shipped: FaBoxOpen,
  Delivered: FaCheckCircle,
  Cancelled: FaTimesCircle,
};

// Custom Step Icon Component
const CustomStepIcon = (props) => {
  const { active, completed, icon } = props;
  const IconComponent = StatusIcons[OrderStatusSteps[icon - 1]];
  return (
    <div
      className={`w-10 h-10 flex items-center justify-center rounded-full ${
        completed
          ? "bg-green-500 text-white"
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
const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
  [`& .MuiStepConnector-line`]: {
    height: 3, // Thickness of the line
    border: 0,
    backgroundColor: theme.palette.mode === "dark" ? "#555" : "#ccc", // Default gray
    transition: "background-color 0.3s ease-in-out",
  },
  [`&.Mui-completed .MuiStepConnector-line`]: {
    backgroundColor: "green", // Completed steps in green
  },
  [`&.Mui-active .MuiStepConnector-line`]: {
    backgroundColor: "green", // Active step connector
  },
}));

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { lastOrders, loading, error } = useSelector(
    (state) => state.orderData
  );
  const [openOrderId, setOpenOrderId] = useState(null);

  // Responsive check for screen size
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  console.log("<<<<<<lastOrders", lastOrders);

  useEffect(() => {
    dispatch(getLastOrdersByUserId({ page: 1, limit: 10 }));
  }, [dispatch]);

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
    <div className="bg-gray-100 dark:bg-gray-900">
      <div className="min-h-screen container mx-auto p-6 md:mb-0 pb-20  text-gray-900 dark:text-white">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Your Orders
        </h1>
        <div className="space-y-6">
          {lastOrders.map((order) => {
            const currentStepIndex = OrderStatusSteps.indexOf(
              order.orderStatus
            );

            return (
              <div
                key={order._id}
                className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md"
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
                      <span className="hidden sm:inline">{order._id}</span>{" "}
                      {/* Full on sm+ screens */}
                      <span className="sm:hidden">
                        {order._id.slice(0, 22)}...
                      </span>{" "}
                      {/* Truncate on sm screens */}
                    </p>

                    <p className="text-gray-500 sm:text-lg text-sm dark:text-gray-400">
                      Total: ₹{order.totalAmount}
                    </p>
                    <p className=" text-gray-500 sm:text-lg text-sm dark:text-gray-400">
                      Ordered on{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-center flex flex-col justify-center items-center ">
                    <span className="text-xl">
                      {StatusIcons[order.orderStatus]()}
                    </span>
                    <p className="mt-5">{order.orderStatus}</p>
                  </div>
                </div>

                {/* Accordion - Order Details */}
                {openOrderId === order._id && (
                  <div className="mt-4 border-t pt-4">
                    {/* Order Progress Bar */}
                    <div className="w-full flex flex-col items-center p-4">
                      <Stepper
                        alternativeLabel={!isSmallScreen} // Horizontal for md+, Vertical for sm-
                        orientation={isSmallScreen ? "vertical" : "horizontal"}
                        activeStep={currentStepIndex}
                        connector={<CustomStepConnector />} // Custom colored connector
                        className="w-full"
                      >
                        {OrderStatusSteps.map((step, index) => (
                          <Step
                            key={index}
                            completed={currentStepIndex > index}
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
                            </StepLabel>
                          </Step>
                        ))}
                      </Stepper>
                    </div>

                    {/* Order Items */}
                    <h3 className="text-lg font-semibold mt-4">Items</h3>
                    <div className="mt-2  p-1 border-[1px] space-y-2">
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
                              } // Use optional chaining
                              alt={item?.product?.name || "Product Image"}
                              width={106} // 14rem converted to px
                              height={106}
                              className="rounded-lg object-cover"
                              priority // Optimized loading
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
                          <div className="mt-5">
                            <p className="text-gray-700 dark:text-gray-400">
                              <strong>Color:</strong> {item.color}
                            </p>
                            <p className="text-gray-700 dark:text-gray-400">
                              <strong>Qty:</strong> {item.quantity}
                            </p>
                            <p className="text-gray-700 dark:text-gray-400">
                              <strong>Price:</strong> ₹{item.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
