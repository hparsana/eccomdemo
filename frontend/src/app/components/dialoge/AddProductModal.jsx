"use client";
import React, { useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { FaPlus, FaTrash } from "react-icons/fa";

const AddProductModal = ({ open, product, onClose, onSubmit }) => {
  const { control, handleSubmit, reset, watch, setError } = useForm({
    defaultValues: product || {
      name: "",
      description: "",
      price: "",
      category: "",
      brand: "",
      stock: "",
      images: [{ url: "", alt: "" }],
      discount: {
        percentage: "",
        amount: "",
        startDate: "",
        endDate: "",
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
  });

  const images = watch("images");

  useEffect(() => {
    if (product) {
      const formattedProduct = {
        ...product,
        discount: {
          ...product.discount,
          startDate: product.discount.startDate
            ? new Date(product.discount.startDate).toISOString().split("T")[0]
            : "",
          endDate: product.discount.endDate
            ? new Date(product.discount.endDate).toISOString().split("T")[0]
            : "",
        },
      };
      reset(formattedProduct);
    }
  }, [product, reset]);

  const validateImages = () => {
    if (!images || images.length === 0 || !images[0]?.url?.trim()) {
      setError("images", {
        type: "manual",
        message: "At least one image URL is required.",
      });
      return false;
    }
    return true;
  };

  const handleFormSubmit = (data) => {
    if (validateImages()) {
      onSubmit(data);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {product ? "Edit Product" : "Add Product"}
        </h2>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <Controller
            name="name"
            control={control}
            rules={{ required: "Product name is required" }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product Name
                </label>
                <input
                  {...field}
                  type="text"
                  className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none ${
                    error ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter product name"
                />
                {error && (
                  <span className="text-red-500 text-sm">{error.message}</span>
                )}
              </div>
            )}
          />

          <Controller
            name="description"
            control={control}
            rules={{ required: "Product description is required" }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  {...field}
                  rows="3"
                  className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none ${
                    error ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter description"
                ></textarea>
                {error && (
                  <span className="text-red-500 text-sm">{error.message}</span>
                )}
              </div>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="price"
              control={control}
              rules={{ required: "Price is required" }}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    {...field}
                    type="number"
                    className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none ${
                      error ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter price"
                  />
                  {error && (
                    <span className="text-red-500 text-sm">
                      {error.message}
                    </span>
                  )}
                </div>
              )}
            />

            <Controller
              name="stock"
              control={control}
              rules={{ required: "Stock is required" }}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Stock
                  </label>
                  <input
                    {...field}
                    type="number"
                    className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none ${
                      error ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter stock"
                  />
                  {error && (
                    <span className="text-red-500 text-sm">
                      {error.message}
                    </span>
                  )}
                </div>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="category"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <input
                    {...field}
                    type="text"
                    className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none ${
                      error ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter category"
                  />
                  {error && (
                    <span className="text-red-500 text-sm">
                      {error.message}
                    </span>
                  )}
                </div>
              )}
            />

            <Controller
              name="brand"
              control={control}
              rules={{ required: "Brand is required" }}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Brand
                  </label>
                  <input
                    {...field}
                    type="text"
                    className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none ${
                      error ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter brand"
                  />
                  {error && (
                    <span className="text-red-500 text-sm">
                      {error.message}
                    </span>
                  )}
                </div>
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Images
            </label>
            <div className="space-y-2">
              {fields.map((item, index) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Controller
                    name={`images.${index}.url`}
                    control={control}
                    rules={{
                      required: "Image URL is required",
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="Image URL"
                        className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none ${
                          error ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => append({ url: "", alt: "" })}
                className="flex items-center text-blue-500 hover:text-blue-600"
              >
                <FaPlus className="mr-2" /> Add Image
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="discount.startDate"
              control={control}
              rules={{ required: "Discount start date is required" }}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Discount Start Date
                  </label>
                  <input
                    {...field}
                    type="date"
                    className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none ${
                      error ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {error && (
                    <span className="text-red-500 text-sm">
                      {error.message}
                    </span>
                  )}
                </div>
              )}
            />

            <Controller
              name="discount.endDate"
              control={control}
              rules={{ required: "Discount end date is required" }}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Discount End Date
                  </label>
                  <input
                    {...field}
                    type="date"
                    className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none ${
                      error ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {error && (
                    <span className="text-red-500 text-sm">
                      {error.message}
                    </span>
                  )}
                </div>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="discount.percentage"
              control={control}
              rules={{ required: "Discount percentage is required" }}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Discount Percentage
                  </label>
                  <input
                    {...field}
                    type="number"
                    className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none ${
                      error ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Discount Percentage"
                  />
                  {error && (
                    <span className="text-red-500 text-sm">
                      {error.message}
                    </span>
                  )}
                </div>
              )}
            />

            <Controller
              name="discount.amount"
              control={control}
              rules={{ required: "Discount amount is required" }}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Discount Amount
                  </label>
                  <input
                    {...field}
                    type="number"
                    className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none ${
                      error ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Discount Amount"
                  />
                  {error && (
                    <span className="text-red-500 text-sm">
                      {error.message}
                    </span>
                  )}
                </div>
              )}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none"
            >
              {product ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
