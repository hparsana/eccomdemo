"use client";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import withAuth from "@/app/components/Auth/withAuth";
import { getLastOrderByUserId } from "@/app/store/Order/orderApi";

const SuccessPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { lastOrder, loading } = useSelector((state) => state.orderData);

  // Fetch last order if missing
  useEffect(() => {
    dispatch(getLastOrderByUserId());
  }, [dispatch]);

  // Format Date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <p className="text-gray-600 dark:text-gray-400">
          Fetching your last order...
        </p>
      </div>
    );
  }

  if (!lastOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-6">
        <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-3xl w-full text-center">
          <FaExclamationCircle className="text-red-500 dark:text-red-400 text-6xl mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            No Recent Orders Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            It looks like you haven&lsquo;t placed any orders yet. Start
            shopping now and get your first order!
          </p>
          <div className="mt-6">
            <button
              onClick={() => router.push("/")}
              className="bg-blue-500 dark:bg-green-500 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-blue-600 dark:hover:bg-green-600"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-3xl w-full">
        <div className="flex flex-col items-center text-center">
          <FaCheckCircle className="text-green-500 dark:text-green-400 text-6xl mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Order Successful!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Thank you for your purchase,{" "}
            <span className="font-semibold text-gray-900 dark:text-gray-200">
              {lastOrder?.user?.fullname}
            </span>
            !
          </p>
        </div>

        {/* Order Details */}
        <div className="mt-6 border-t border-gray-300 dark:border-gray-700 pt-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-300">
            Order Details
          </h2>
          <p className="text-gray-700 dark:text-gray-400">
            <strong>Order ID:</strong> {lastOrder._id}
          </p>
          <p className="text-gray-700 dark:text-gray-400">
            <strong>Payment Status:</strong> {lastOrder.paymentDetails.status}
          </p>
          <p className="text-gray-700 dark:text-gray-400">
            <strong>Payment Method:</strong> {lastOrder.paymentDetails.method}
          </p>
          <p className="text-gray-700 dark:text-gray-400">
            <strong>Total Amount:</strong> ₹{lastOrder.totalAmount}
          </p>
          <p className="text-gray-700 dark:text-gray-400">
            <strong>Order Date:</strong> {formatDate(lastOrder.createdAt)}
          </p>

          {/* Discount Section */}
          {lastOrder.discount && lastOrder.discount.amount > 0 && (
            <div className="mt-3 bg-green-100 dark:bg-green-900 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-600 dark:text-green-300">
                Discount Applied
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Discount Amount:</strong> ₹{lastOrder.discount.amount}
              </p>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="mt-6 border-t border-gray-300 dark:border-gray-700 pt-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-300">
            Ordered Items
          </h2>
          <div className="mt-3">
            {lastOrder.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-gray-300 dark:border-gray-700 pb-3 mb-3"
              >
                <div className="flex items-center">
                  <img
                    src={
                      item.product?.image || "https://via.placeholder.com/50"
                    }
                    alt={item.product?.name}
                    className="w-14 h-14 rounded-lg object-cover mr-3"
                  />
                  <div>
                    <p className="text-gray-900 dark:text-gray-200 font-semibold">
                      {item.product.name}
                    </p>
                    <p className="text-gray-700 dark:text-gray-400 text-sm">
                      {item.product.brand} - {item.product.category}
                    </p>
                  </div>
                </div>
                <div>
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

        {/* Shipping Details */}
        <div className="mt-6 border-t border-gray-300 dark:border-gray-700 pt-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-300">
            Shipping Address
          </h2>
          <p className="text-gray-700 dark:text-gray-400">
            {lastOrder.shippingDetails.address}
          </p>
          <p className="text-gray-700 dark:text-gray-400">
            {lastOrder.shippingDetails.city}, {lastOrder.shippingDetails.state},{" "}
            {lastOrder.shippingDetails.country}
          </p>
          <p className="text-gray-700 dark:text-gray-400">
            <strong>Postal Code:</strong> {lastOrder.shippingDetails.postalCode}
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => router.push("/productdata")}
            className="bg-blue-500 dark:bg-green-500 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-blue-600 dark:hover:bg-green-600"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default withAuth(SuccessPage, true, ["USER", "ADMIN"]);
