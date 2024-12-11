"use client";

import { getAllOrders, UpdateOrder } from "@/app/store/Order/orderApi";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

const EditOrderModal = ({ open, order, onClose }) => {
  const { currentPage } = useSelector((state) => state.orderData);
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      orderStatus: order.orderStatus,
    },
  });
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (order) reset({ orderStatus: order.orderStatus });
  }, [order, reset]);

  if (!open) return null;

  const handleUpdate = async (data) => {
    try {
      await dispatch(
        UpdateOrder({
          id: order?._id, // Pass the order ID
          orderStatus: data.orderStatus, // Pass the updated status
        })
      ).unwrap();

      // Refetch orders after updating
      dispatch(
        getAllOrders({
          page: currentPage,
        })
      );

      onClose();
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Order</h2>

        <form onSubmit={handleSubmit(handleUpdate)} className="space-y-6">
          <Controller
            name="orderStatus"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  {...field}
                  className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            )}
          />

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOrderModal;
