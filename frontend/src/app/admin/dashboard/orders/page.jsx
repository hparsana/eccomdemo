"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteOrder, getAllOrders } from "@/app/store/Order/orderApi";
import { Pagination } from "@mui/material";
import {
  FaEdit,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaTrash,
} from "react-icons/fa";
import EditOrderModal from "@/app/components/dialoge/EditOrderModal";
import Image from "next/image";

const OrdersDashboard = () => {
  const dispatch = useDispatch();

  const {
    orderList: orders,
    totalOrders,
    currentPage,
    loading,
    error,
  } = useSelector((state) => state.orderData);
  const { darkMode } = useSelector((state) => state.userAuthData);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const recordsPerPage = 10;

  useEffect(() => {
    dispatch(
      getAllOrders({
        page: currentPage,
        limit: recordsPerPage,
      })
    );
  }, [dispatch, currentPage]);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = orders;

      if (searchQuery) {
        filtered = filtered.filter(
          (order) =>
            order._id.includes(searchQuery) ||
            order.user?.email
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            order.shippingDetails?.address
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase())
        );
      }

      if (selectedStatus) {
        filtered = filtered.filter(
          (order) => order.orderStatus === selectedStatus
        );
      }

      setFilteredOrders(filtered);
    };

    applyFilters();
  }, [orders, searchQuery, selectedStatus]);

  const toggleExpandRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteOrder(id)).unwrap();

      // Refetch orders after updating
      dispatch(
        getAllOrders({
          limit: recordsPerPage,
        })
      );
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  const handlePageChange = (event, page) => {
    dispatch(
      getAllOrders({
        page,
        limit: recordsPerPage,
      })
    );
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen dark:bg-gray-900">
      <h1 className="text-2xl font-bold p-6 bg-slate-400 dark:bg-gray-900 text-white">
        Orders List
      </h1>
      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by Order ID or Email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 px-4 py-2 pl-10 w-full rounded-lg focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
          />
          <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border border-gray-300 px-4 py-2 md:w-auto w-full rounded-lg focus:outline-none focus:ring focus:ring-blue-300 mt-4 md:mt-0 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      {loading ? (
        <p className="text-center text-gray-600">Loading orders...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto max-w-[100vw] -mx-6 px-6">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="p-4 text-left text-gray-600 dark:text-gray-300">
                  Order ID
                </th>
                <th className="p-4 text-left text-gray-600 dark:text-gray-300">
                  User Email
                </th>
                <th className="p-4 text-left text-gray-600 dark:text-gray-300">
                  Status
                </th>
                <th className="p-4 text-left text-gray-600 dark:text-gray-300">
                  Total Amount
                </th>
                <th className="p-4 text-center text-gray-600 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <React.Fragment key={order._id}>
                  <tr
                    className="border-t hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => toggleExpandRow(order._id)}
                  >
                    <td className="p-4 text-gray-800 dark:text-gray-300">
                      {order._id}
                    </td>
                    <td className="p-4 text-gray-800 dark:text-gray-300">
                      {order.user?.email}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-white text-sm ${
                          order.orderStatus === "Pending"
                            ? "bg-yellow-500"
                            : order.orderStatus === "Processing"
                              ? "bg-orange-500"
                              : order.orderStatus === "Shipped"
                                ? "bg-blue-500"
                                : order.orderStatus === "Delivered"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="p-4 text-gray-800 dark:text-gray-300">
                      ₹{order.totalAmount}
                    </td>
                    <td className="p-4 text-center flex space-x-4 justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(order);
                        }}
                        className="text-yellow-500 hover:text-yellow-600"
                      >
                        <FaEdit size={20} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(order._id);
                        }}
                        className="text-red-500 hover:text-red-600"
                      >
                        <FaTrash size={20} />
                      </button>
                    </td>
                  </tr>
                  {expandedRow === order._id && (
                    <tr className="border-t bg-gray-100 dark:bg-gray-700">
                      <td colSpan="5" className="p-4">
                        {/* Order Details */}
                        <div>
                          <p className="text-gray-800 dark:text-gray-300">
                            <strong>Shipping Address:</strong>{" "}
                            {order.shippingDetails.address},{" "}
                            {order.shippingDetails.city},{" "}
                            {order.shippingDetails.state},{" "}
                            {order.shippingDetails.country}
                          </p>
                          <p className="text-gray-800 dark:text-gray-300">
                            <strong>Payment Method:</strong>{" "}
                            {order.paymentDetails.method} (
                            {order.paymentDetails.status})
                          </p>
                          <p className="text-gray-800 dark:text-gray-300">
                            <strong>Items:</strong>
                          </p>
                          <ul className="list-disc pl-5 flex gap-x-5 lg:flex-nowrap flex-wrap text-gray-600 dark:text-gray-300">
                            {order.items.map((item) => (
                              <div className="mt-5 w-1/3" key={item._id}>
                                <li className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-shadow duration-200 mb-3">
                                  {/* Left Section */}
                                  <div className="flex flex-col">
                                    <p className="text-lg font-bold text-gray-800 dark:text-gray-300">
                                      {item.product?.name}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      <span className="font-medium text-gray-700 dark:text-gray-300">
                                        Category:
                                      </span>{" "}
                                      {item.product?.category}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      <span className="font-medium text-gray-700 dark:text-gray-300">
                                        Brand:
                                      </span>{" "}
                                      {item.product?.brand}
                                    </p>
                                  </div>

                                  {/* Middle Section */}
                                  <div className="flex flex-col items-center">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      <span className="font-semibold">
                                        {item?.quantity}
                                      </span>{" "}
                                      x ₹{item.product?.price.toFixed(2)}
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">
                                      Price per item
                                    </p>
                                  </div>

                                  {/* Right Section */}
                                  <div className="text-right">
                                    <p className="text-xl font-bold text-green-600">
                                      ₹
                                      {Number(
                                        item.quantity * item.product?.price
                                      ).toFixed(2)}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      Total Amount
                                    </p>
                                  </div>
                                </li>

                                <div className="flex gap-x-5 mt-2">
                                  {item.product?.images?.map((dt, index) => {
                                    return (
                                      <Image
                                        src={dt?.url}
                                        alt={index}
                                        width={100}
                                        height={100}
                                        key={index}
                                        className="w-16 h-16 object-cover"
                                      />
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </ul>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex justify-end">
        <Pagination
          count={Math.ceil(totalOrders / recordsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
          color="primary"
          sx={{
            "& .MuiPaginationItem-root": {
              color: darkMode ? "white" : "black", // Default text color
              borderColor: darkMode ? "#6b7280" : "#d1d5db", // Default border color
              backgroundColor: darkMode ? "#1f2937" : "#ffffff", // Default background color
              "&:hover": {
                backgroundColor: darkMode ? "#374151" : "#f3f4f6", // Hover background color
              },
            },
            "& .Mui-selected": {
              color: darkMode ? "#ffffff" : "#ffffff", // Active text color
              borderColor: darkMode ? "#10b981" : "#2563eb", // Active border color
              backgroundColor: darkMode ? "#10b981" : "#2563eb", // Active background color
              fontWeight: "bold", // Active font weight
              "&:hover": {
                backgroundColor: darkMode ? "#059669" : "#1d4ed8", // Hover effect on active item
              },
            },
          }}
        />
      </div>

      {/* Edit Order Modal */}
      {editModalOpen && selectedOrder && (
        <EditOrderModal
          open={editModalOpen}
          order={selectedOrder}
          onClose={() => setEditModalOpen(false)}
        />
      )}
    </div>
  );
};

export default OrdersDashboard;
