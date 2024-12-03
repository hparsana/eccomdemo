"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";

const EditUserModal = ({ open, user, onClose, onSubmit }) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: user || {
      fullname: "",
      email: "",
      role: "",
    },
  });

  React.useEffect(() => {
    if (user) {
      reset(user); // Populate form with user data when modal opens
    }
  }, [user, reset]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      {/* Modal Container */}
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Edit User</h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Full Name */}
          <Controller
            name="fullname"
            control={control}
            rules={{ required: "Full name is required" }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  {...field}
                  type="text"
                  className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none ${
                    error ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter full name"
                />
                {error && (
                  <span className="text-red-500 text-sm">{error.message}</span>
                )}
              </div>
            )}
          />

          {/* Email */}
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  {...field}
                  type="email"
                  className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none ${
                    error ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter email"
                />
                {error && (
                  <span className="text-red-500 text-sm">{error.message}</span>
                )}
              </div>
            )}
          />

          {/* Role */}
          <Controller
            name="role"
            control={control}
            rules={{ required: "Role is required" }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  {...field}
                  className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none ${
                    error ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select a role</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="USER">USER</option>
                </select>
                {error && (
                  <span className="text-red-500 text-sm">{error.message}</span>
                )}
              </div>
            )}
          />

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
