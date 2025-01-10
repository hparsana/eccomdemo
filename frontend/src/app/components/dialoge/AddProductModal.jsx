"use client";
import { getAllCategories } from "@/app/store/Category/categoryApi";
import {
  addProduct,
  getAllProducts,
  updateProduct,
} from "@/app/store/Product/productApi";
import { Modal } from "@mui/material";
import React, { useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

const AddProductModal = ({ open, product, onClose }) => {
  const { control, handleSubmit, reset, watch, setError } = useForm({
    defaultValues: {
      name: product?.name || "", // Initialize as empty string
      description: product?.description || "", // Initialize as empty string
      price: product?.price || "", // Initialize as empty string
      originalPrice: product?.originalPrice || "", // Initialize as empty string
      category: product?.category || "", // Initialize as empty string
      subcategory: product?.subcategory || "", // Initialize as empty string
      brand: product?.brand || "", // Initialize as empty string
      stock: product?.stock || 0, // Initialize as number
      weight: product?.weight || 0, // Initialize as number
      dimensions: product?.dimensions || { length: 0, width: 0, height: 0 }, // Initialize as object
      size: product?.size || [], // Initialize as array
      color: product?.color || [], // Initialize as array
      images: product?.images?.length ? product.images : [{ url: "", alt: "" }], // Initialize with array containing empty object
      warranty: product?.warranty || "No warranty", // Default value
      batteryLife: product?.batteryLife || "N/A", // Default value
      features: product?.features || [], // Initialize as array
      resolution: product?.resolution || "N/A", // Default value
      processor: product?.processor || "N/A", // Default value
      ram: product?.ram || "N/A", // Default value
      storage: product?.storage || "N/A", // Default value
      tags: product?.tags || [], // Initialize as array
      generalSpecifications: product?.generalSpecifications || [], // Initialize as array of objects
      discount: {
        percentage: product?.discount?.percentage || "", // Initialize as empty string
        amount: product?.discount?.amount || "", // Initialize as empty string
        startDate: product?.discount?.startDate
          ? new Date(product.discount?.startDate).toISOString().split("T")[0]
          : "", // Convert date or initialize as empty string
        endDate: product?.discount?.endDate
          ? new Date(product.discount?.endDate).toISOString().split("T")[0]
          : "", // Convert date or initialize as empty string
      },
    },
  });

  const { currentPage } = useSelector((state) => state.productData);
  const {
    categoryList: categories,
    loading,
    error,
  } = useSelector((state) => state.categoryData);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
  });

  const {
    fields: sizeFields,
    append: appendSize,
    remove: removeSize,
  } = useFieldArray({
    control,
    name: "size",
  });
  const {
    fields: featuresFields,
    append: appendFeatures,
    remove: removeFeatures,
  } = useFieldArray({
    control,
    name: "features",
  });
  const {
    fields: colorFields,
    append: appendColor,
    remove: removeColor,
  } = useFieldArray({
    control,
    name: "color",
  });

  const {
    fields: generalSpecificationFields,
    append: appendSpecification,
    remove: removeSpecification,
  } = useFieldArray({
    control,
    name: "generalSpecifications", // This should match the key in `defaultValues`
  });

  const selectedCategory = watch("category");
  const selectedSubcategory = watch("subcategory");

  useEffect(() => {
    if (product) {
      const formattedProduct = {
        ...product,
        discount: {
          ...product.discount,
          startDate: product?.discount?.startDate
            ? new Date(product?.discount?.startDate).toISOString().split("T")[0]
            : "",
          endDate: product?.discount?.endDate
            ? new Date(product?.discount?.endDate).toISOString().split("T")[0]
            : "",
        },
      };
      reset(formattedProduct);
    }
  }, [product, reset]);

  const validateImages = () => {
    const images = watch("images");
    if (!images || images.length === 0 || !images[0]?.url?.trim()) {
      setError("images", {
        type: "manual",
        message: "At least one image URL is required.",
      });
      return false;
    }
    return true;
  };

  const handleFormSubmit = async (data) => {
    if (!validateImages()) return;

    const formattedData = {
      ...data,
      price: parseFloat(data.price),
      originalPrice: parseFloat(data.originalPrice),

      stock: parseFloat(data.stock),
      weight: parseFloat(data.weight),
      dimensions: {
        length: parseFloat(data.dimensions.length),
        width: parseFloat(data.dimensions.width),
        height: parseFloat(data.dimensions.height),
      },
      discount: {
        ...data.discount,
        percentage: parseFloat(data.discount.percentage),
        amount: parseFloat(data.discount.amount),
      },
    };

    try {
      if (product) {
        // Update existing product
        await dispatch(
          updateProduct({
            id: product._id,
            productData: formattedData,
          })
        ).unwrap();
        dispatch(
          getAllProducts({
            page: currentPage,
          })
        );
      } else {
        // Add new product
        await dispatch(addProduct(formattedData)).unwrap();
      }

      dispatch(
        getAllProducts({
          page: currentPage,
        })
      );
      onClose();
    } catch (error) {
      alert(`Failed to ${product ? "update" : "add"} product: ${error}`);
    }
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="add-product-modal">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white w-full max-w-5xl rounded-lg shadow-lg relative p-6 overflow-y-auto max-h-[95vh] dark:bg-gray-800">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-300">
            {product ? "Edit Product" : "Add Product"}
          </h2>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <Controller
              name="name"
              control={control}
              rules={{ required: "Product name is required" }}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                    Product Name
                  </label>
                  <input
                    {...field}
                    type="text"
                    className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
                      error ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter product name"
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
              name="description"
              control={control}
              rules={{ required: "Product description is required" }}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    {...field}
                    rows="3"
                    className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
                      error ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter description"
                  ></textarea>
                  {error && (
                    <span className="text-red-500 text-sm">
                      {error.message}
                    </span>
                  )}
                </div>
              )}
            />

            <div className="grid md:grid-cols-3 gap-4">
              <Controller
                name="originalPrice"
                control={control}
                rules={{ required: "originalPrice is required" }}
                render={({ field, fieldState: { error } }) => (
                  <div>
                    <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                      original Price
                    </label>
                    <input
                      {...field}
                      type="number"
                      className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
                        error ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter originalPrice"
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
                name="price"
                control={control}
                rules={{ required: "Price is required" }}
                render={({ field, fieldState: { error } }) => (
                  <div>
                    <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                      Price
                    </label>
                    <input
                      {...field}
                      type="number"
                      className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
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
                    <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                      Stock
                    </label>
                    <input
                      {...field}
                      type="number"
                      className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
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

            <div className="grid grid-cols-3 gap-4">
              <Controller
                name="category"
                control={control}
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <div>
                    <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      {...field}
                      className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
                        error ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={!!product} // Disable if editing
                    >
                      <option value="">Select a category</option>
                      {categories?.map((datas, key) => (
                        <option value={datas?.name} key={datas?._id}>
                          {datas?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              />
              <Controller
                name="subcategory"
                control={control}
                rules={{ required: "Subcategory is required" }}
                render={({ field, fieldState: { error } }) => (
                  <div>
                    <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                      Subcategory
                    </label>
                    <select
                      {...field}
                      className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
                        error ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={!!product} // Disable if editing
                    >
                      <option value="">Select a Subcategory</option>
                      {categories
                        ?.find((cat) => cat.name === selectedCategory)
                        ?.subcategories?.map((subcat) => (
                          <option value={subcat.name} key={subcat._id}>
                            {subcat.name}
                          </option>
                        ))}
                    </select>
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
                    <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                      Brand
                    </label>
                    <input
                      {...field}
                      type="text"
                      className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
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
            {selectedSubcategory?.toLowerCase() === "mobile phones" && (
              <div>
                <h1 className="dark:text-white text-[20px] pb-2 font-medium">
                  General
                </h1>
                <div className="grid md:grid-cols-2 gap-4">
                  <Controller
                    name="InTheBox"
                    control={control}
                    rules={{ required: "InTheBox is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          In The Box
                        </label>
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
                            error ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter Handset, Sim Ejection Pin, USB Cable, Manual"
                        />
                        {error && (
                          <span className="text-red-500 text-sm">
                            {error.message}
                          </span>
                        )}
                      </div>
                    )}
                  />{" "}
                  <Controller
                    name="ModelNumber"
                    control={control}
                    rules={{ required: "Product Model Number is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          Model Number
                        </label>
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
                            error ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter Model Number"
                        />
                        {error && (
                          <span className="text-red-500 text-sm">
                            {error.message}
                          </span>
                        )}
                      </div>
                    )}
                  />{" "}
                  <Controller
                    name="ModelName"
                    control={control}
                    rules={{ required: "Product Model Name is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          Model Name
                        </label>
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
                            error ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter Model Name"
                        />
                        {error && (
                          <span className="text-red-500 text-sm">
                            {error.message}
                          </span>
                        )}
                      </div>
                    )}
                  />{" "}
                  <Controller
                    name="SIMType"
                    control={control}
                    rules={{ required: "Product SIM Type is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          SIM Type
                        </label>
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
                            error ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter SIM Type"
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
                <div className="grid md:grid-cols-4 mt-6 gap-4">
                  <Controller
                    name="HybridSimSlot"
                    control={control}
                    defaultValue="Yes" // Automatically select "Yes" by default
                    rules={{
                      required: "Please select if Hybrid SIM Slot is available",
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          Hybrid SIM Slot
                        </label>
                        <div className="flex space-x-4 mt-2">
                          {/* Yes Option */}
                          <label className="flex items-center space-x-2">
                            <input
                              {...field}
                              type="radio"
                              value="Yes"
                              checked={field.value === "Yes"} // Bind the selected value
                              className="form-radio h-5 w-5 text-blue-600 focus:ring focus:ring-blue-500"
                            />
                            <span className="text-sm dark:text-gray-300 text-gray-700">
                              Yes
                            </span>
                          </label>

                          {/* No Option */}
                          <label className="flex items-center space-x-2">
                            <input
                              {...field}
                              type="radio"
                              value="No"
                              checked={field.value === "No"} // Bind the selected value
                              className="form-radio h-5 w-5 text-blue-600 focus:ring focus:ring-blue-500"
                            />
                            <span className="text-sm dark:text-gray-300 text-gray-700">
                              No
                            </span>
                          </label>
                        </div>

                        {error && (
                          <span className="text-red-500 text-sm">
                            {error.message}
                          </span>
                        )}
                      </div>
                    )}
                  />
                  <Controller
                    name="Touchscreen"
                    control={control}
                    defaultValue="Yes" // Automatically select "Yes"
                    rules={{
                      required: "Please select if Touchscreen is available",
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          Touchscreen
                        </label>
                        <div className="flex space-x-4 mt-2">
                          {/* Yes Option */}
                          <label className="flex items-center space-x-2">
                            <input
                              {...field}
                              type="radio"
                              value="Yes"
                              checked={field.value === "Yes"}
                              className="form-radio h-5 w-5 text-blue-600 focus:ring focus:ring-blue-500"
                            />
                            <span className="text-sm dark:text-gray-300 text-gray-700">
                              Yes
                            </span>
                          </label>

                          {/* No Option */}
                          <label className="flex items-center space-x-2">
                            <input
                              {...field}
                              type="radio"
                              value="No"
                              checked={field.value === "No"}
                              className="form-radio h-5 w-5 text-blue-600 focus:ring focus:ring-blue-500"
                            />
                            <span className="text-sm dark:text-gray-300 text-gray-700">
                              No
                            </span>
                          </label>
                        </div>

                        {error && (
                          <span className="text-red-500 text-sm">
                            {error.message}
                          </span>
                        )}
                      </div>
                    )}
                  />
                  {/* OTG Compatible Field */}
                  <Controller
                    name="OTGCompatible"
                    control={control}
                    defaultValue="Yes" // Auto-select "Yes"
                    rules={{
                      required: "Please select if OTG Compatible is available",
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          OTG Compatible
                        </label>
                        <div className="flex space-x-4 mt-2">
                          <label className="flex items-center space-x-2">
                            <input
                              {...field}
                              type="radio"
                              value="Yes"
                              checked={field.value === "Yes"}
                              className="form-radio h-5 w-5 text-blue-600 focus:ring focus:ring-blue-500"
                            />
                            <span className="text-sm dark:text-gray-300 text-gray-700">
                              Yes
                            </span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              {...field}
                              type="radio"
                              value="No"
                              checked={field.value === "No"}
                              className="form-radio h-5 w-5 text-blue-600 focus:ring focus:ring-blue-500"
                            />
                            <span className="text-sm dark:text-gray-300 text-gray-700">
                              No
                            </span>
                          </label>
                        </div>
                        {error && (
                          <span className="text-red-500 text-sm">
                            {error.message}
                          </span>
                        )}
                      </div>
                    )}
                  />

                  {/* Quick Charging Field */}
                  <Controller
                    name="QuickCharging"
                    control={control}
                    defaultValue="Yes" // Auto-select "Yes"
                    rules={{
                      required: "Please select if Quick Charging is available",
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          Quick Charging
                        </label>
                        <div className="flex space-x-4 mt-2">
                          <label className="flex items-center space-x-2">
                            <input
                              {...field}
                              type="radio"
                              value="Yes"
                              checked={field.value === "Yes"}
                              className="form-radio h-5 w-5 text-blue-600 focus:ring focus:ring-blue-500"
                            />
                            <span className="text-sm dark:text-gray-300 text-gray-700">
                              Yes
                            </span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              {...field}
                              type="radio"
                              value="No"
                              checked={field.value === "No"}
                              className="form-radio h-5 w-5 text-blue-600 focus:ring focus:ring-blue-500"
                            />
                            <span className="text-sm dark:text-gray-300 text-gray-700">
                              No
                            </span>
                          </label>
                        </div>
                        {error && (
                          <span className="text-red-500 text-sm">
                            {error.message}
                          </span>
                        )}
                      </div>
                    )}
                  />
                </div>
                <h1 className="dark:text-white text-[20px] mt-4 py-2 font-medium">
                  Display Features
                </h1>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Display Size Field */}
                  <Controller
                    name="DisplaySize"
                    control={control}
                    rules={{ required: "Display Size is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          Display Size
                        </label>
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
                            error ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter Display Size (e.g., 15.49 cm (6.1 inch))"
                        />
                        {error && (
                          <span className="text-red-500 text-sm">
                            {error.message}
                          </span>
                        )}
                      </div>
                    )}
                  />

                  {/* Resolution Field */}
                  <Controller
                    name="Resolution"
                    control={control}
                    rules={{ required: "Resolution is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          Resolution
                        </label>
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
                            error ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter Resolution (e.g., 2340 x 1080 Pixels)"
                        />
                        {error && (
                          <span className="text-red-500 text-sm">
                            {error.message}
                          </span>
                        )}
                      </div>
                    )}
                  />
                  {/* Resolution Type Field */}
                  <Controller
                    name="ResolutionType"
                    control={control}
                    rules={{ required: "Resolution Type is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          Resolution Type
                        </label>
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
                            error ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter Resolution Type (e.g., Full HD+)"
                        />
                        {error && (
                          <span className="text-red-500 text-sm">
                            {error.message}
                          </span>
                        )}
                      </div>
                    )}
                  />

                  {/* GPU Field */}
                  <Controller
                    name="GPU"
                    control={control}
                    rules={{ required: "GPU is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          GPU
                        </label>
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
                            error ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter GPU (e.g., Qualcomm Adreno 740)"
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
                    name="OtherDisplayFeatures"
                    control={control}
                    rules={{ required: "Other Display Features are required" }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          Other Display Features
                        </label>
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
                            error ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter Other Display Features (e.g., Adaptive Refresh Rate: 48 Hz - 120 Hz)"
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
                    name="DisplayType"
                    control={control}
                    rules={{ required: "Display Type is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          Display Type
                        </label>
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
                            error ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter Display Type (e.g., Full HD+ Dynamic AMOLED 2X)"
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
                    name="HDGameSupport"
                    control={control}
                    defaultValue="Yes" // Automatically select "Yes" by default
                    rules={{
                      required: "Please select if HD Game Support is available",
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          HD Game Support
                        </label>
                        <div className="flex space-x-4 mt-2">
                          {/* Yes Option */}
                          <label className="flex items-center space-x-2">
                            <input
                              {...field}
                              type="radio"
                              value="Yes"
                              checked={field.value === "Yes"} // Bind the selected value
                              className="form-radio h-5 w-5 text-blue-600 focus:ring focus:ring-blue-500"
                            />
                            <span className="text-sm dark:text-gray-300 text-gray-700">
                              Yes
                            </span>
                          </label>

                          {/* No Option */}
                          <label className="flex items-center space-x-2">
                            <input
                              {...field}
                              type="radio"
                              value="No"
                              checked={field.value === "No"} // Bind the selected value
                              className="form-radio h-5 w-5 text-blue-600 focus:ring focus:ring-blue-500"
                            />
                            <span className="text-sm dark:text-gray-300 text-gray-700">
                              No
                            </span>
                          </label>
                        </div>

                        {error && (
                          <span className="text-red-500 text-sm">
                            {error.message}
                          </span>
                        )}
                      </div>
                    )}
                  />
                </div>
                <h1 className="dark:text-white text-[20px] mt-4 py-2 font-medium">
                  Os & Processor Features
                </h1>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Operating System Field */}
                  <Controller
                    name="OperatingSystem"
                    control={control}
                    rules={{ required: "Operating System is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          Operating System
                        </label>
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
                            error ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter Operating System (e.g., Android 13)"
                        />
                        {error && (
                          <span className="text-red-500 text-sm">
                            {error.message}
                          </span>
                        )}
                      </div>
                    )}
                  />

                  {/* Processor Brand Field */}
                  <Controller
                    name="ProcessorBrand"
                    control={control}
                    rules={{ required: "Processor Brand is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          Processor Brand
                        </label>
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
                            error ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter Processor Brand (e.g., Snapdragon)"
                        />
                        {error && (
                          <span className="text-red-500 text-sm">
                            {error.message}
                          </span>
                        )}
                      </div>
                    )}
                  />

                  {/* Processor Type Field */}
                  <Controller
                    name="ProcessorType"
                    control={control}
                    rules={{ required: "Processor Type is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          Processor Type
                        </label>
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
                            error ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter Processor Type (e.g., Qualcomm Snapdragon 8 Gen 2)"
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
                    name="ProcessorCore"
                    control={control}
                    rules={{ required: "Processor Core is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          Processor Core
                        </label>
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
                            error ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter Processor Core (e.g., Octa Core)"
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
                    name="PrimaryClockSpeed"
                    control={control}
                    rules={{ required: "Primary Clock Speed is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <div className="mt-4">
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          Primary Clock Speed
                        </label>
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
                            error ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter Primary Clock Speed (e.g., 3.36 GHz)"
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
                    name="SecondaryClockSpeed"
                    control={control}
                    rules={{ required: "Secondary Clock Speed is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          Secondary Clock Speed
                        </label>
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
                            error ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter Secondary Clock Speed (e.g., 3.36 GHz)"
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
                    name="OperatingFrequency"
                    control={control}
                    rules={{ required: "Operating Frequency is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          Operating Frequency
                        </label>
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
                            error ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter Operating Frequency (e.g., 2G GSM: 850/900/1800/1900 MHz)"
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
                <h1 className="dark:text-white text-[20px] mt-4 py-2 font-medium">
                  Memory & Storage Features
                </h1>
                <div className="grid md:grid-cols-2 gap-4">
                  <Controller
                    name="InternalStorage"
                    control={control}
                    rules={{ required: "Internal Storage is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          Internal Storage
                        </label>
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
                            error ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter Internal Storage (e.g., 256 GB)"
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
                    name="RAM"
                    control={control}
                    rules={{ required: "RAM is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          RAM
                        </label>
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
                            error ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter RAM (e.g., 8 GB)"
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
                    name="TotalMemory"
                    control={control}
                    rules={{ required: "Total Memory is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          Total Memory
                        </label>
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
                            error ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter Total Memory (e.g., 256 GB)"
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
                <h1 className="dark:text-white text-[20px] mt-4 py-2 font-medium">
                  Camera Features
                </h1>
                <div className="grid md:grid-cols-2 gap-4">
                  <Controller
                    name="PrimaryCamera"
                    control={control}
                    rules={{ required: "Primary Camera is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          Primary Camera
                        </label>
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
                            error ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter Primary Camera (e.g., 50MP + 10MP + 12MP)"
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
                    name="PrimaryCameraFeatures"
                    control={control}
                    rules={{ required: "Primary Camera Features are required" }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          Primary Camera Features
                        </label>
                        <textarea
                          {...field}
                          rows="4"
                          className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
                            error ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter Primary Camera Features (e.g., AR Zone, Bixby Vision, Director's View, Food, Hyperlapse, Night, etc.)"
                        ></textarea>
                        {error && (
                          <span className="text-red-500 text-sm">
                            {error.message}
                          </span>
                        )}
                      </div>
                    )}
                  />
                  <Controller
                    name="SecondaryCamera"
                    control={control}
                    rules={{ required: "Secondary Camera is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          Secondary Camera
                        </label>
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
                            error ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter Secondary Camera (e.g., 12MP Front Camera)"
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
                    name="VideoRecordingResolution"
                    control={control}
                    rules={{
                      required: "Video Recording Resolution is required",
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          Video Recording Resolution
                        </label>
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
                            error ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter Video Recording Resolution (e.g., 7680 x 4320 pixel)"
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
                    name="DigitalZoom"
                    control={control}
                    rules={{ required: "Digital Zoom is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          Digital Zoom
                        </label>
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
                            error ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter Digital Zoom (e.g., Upto 30x)"
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
                    name="FrameRate"
                    control={control}
                    rules={{ required: "Frame Rate is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          Frame Rate
                        </label>
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
                            error ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter Frame Rate (e.g., 30 fps)"
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
                    name="DualCameraLens"
                    control={control}
                    rules={{ required: "Dual Camera Lens is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          Dual Camera Lens
                        </label>
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
                            error ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter Dual Camera Lens (e.g., Primary Camera)"
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
                <div className="grid md:grid-cols-4 mt-5 gap-8">
                  <Controller
                    name="OpticalZoom"
                    control={control}
                    defaultValue="Yes" // Automatically select "Yes" by default
                    rules={{
                      required: "Please select if Optical Zoom is available",
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          Optical Zoom
                        </label>
                        <div className="flex space-x-4 mt-2">
                          <label className="flex items-center space-x-2">
                            <input
                              {...field}
                              type="radio"
                              value="Yes"
                              checked={field.value === "Yes"}
                              className="form-radio h-5 w-5 text-blue-600 focus:ring focus:ring-blue-500"
                            />
                            <span className="text-sm dark:text-gray-300 text-gray-700">
                              Yes
                            </span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              {...field}
                              type="radio"
                              value="No"
                              checked={field.value === "No"}
                              className="form-radio h-5 w-5 text-blue-600 focus:ring focus:ring-blue-500"
                            />
                            <span className="text-sm dark:text-gray-300 text-gray-700">
                              No
                            </span>
                          </label>
                        </div>
                        {error && (
                          <span className="text-red-500 text-sm">
                            {error.message}
                          </span>
                        )}
                      </div>
                    )}
                  />
                  <Controller
                    name="SecondaryCameraAvailable"
                    control={control}
                    defaultValue="Yes"
                    rules={{
                      required:
                        "Please select if Secondary Camera is available",
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          Secondary Camera Available
                        </label>
                        <div className="flex space-x-4 mt-2">
                          <label className="flex items-center space-x-2">
                            <input
                              {...field}
                              type="radio"
                              value="Yes"
                              checked={field.value === "Yes"}
                              className="form-radio h-5 w-5 text-blue-600 focus:ring focus:ring-blue-500"
                            />
                            <span className="text-sm dark:text-gray-300 text-gray-700">
                              Yes
                            </span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              {...field}
                              type="radio"
                              value="No"
                              checked={field.value === "No"}
                              className="form-radio h-5 w-5 text-blue-600 focus:ring focus:ring-blue-500"
                            />
                            <span className="text-sm dark:text-gray-300 text-gray-700">
                              No
                            </span>
                          </label>
                        </div>
                        {error && (
                          <span className="text-red-500 text-sm">
                            {error.message}
                          </span>
                        )}
                      </div>
                    )}
                  />
                  <Controller
                    name="Flash"
                    control={control}
                    defaultValue="Yes"
                    rules={{
                      required: "Please select if Flash is available",
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          Flash
                        </label>
                        <div className="flex space-x-4 mt-2">
                          <label className="flex items-center space-x-2">
                            <input
                              {...field}
                              type="radio"
                              value="Yes"
                              checked={field.value === "Yes"}
                              className="form-radio h-5 w-5 text-blue-600 focus:ring focus:ring-blue-500"
                            />
                            <span className="text-sm dark:text-gray-300 text-gray-700">
                              Yes
                            </span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              {...field}
                              type="radio"
                              value="No"
                              checked={field.value === "No"}
                              className="form-radio h-5 w-5 text-blue-600 focus:ring focus:ring-blue-500"
                            />
                            <span className="text-sm dark:text-gray-300 text-gray-700">
                              No
                            </span>
                          </label>
                        </div>
                        {error && (
                          <span className="text-red-500 text-sm">
                            {error.message}
                          </span>
                        )}
                      </div>
                    )}
                  />
                  <Controller
                    name="HDRecording"
                    control={control}
                    defaultValue="Yes"
                    rules={{
                      required: "Please select if HD Recording is available",
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          HD Recording
                        </label>
                        <div className="flex space-x-4 mt-2">
                          <label className="flex items-center space-x-2">
                            <input
                              {...field}
                              type="radio"
                              value="Yes"
                              checked={field.value === "Yes"}
                              className="form-radio h-5 w-5 text-blue-600 focus:ring focus:ring-blue-500"
                            />
                            <span className="text-sm dark:text-gray-300 text-gray-700">
                              Yes
                            </span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              {...field}
                              type="radio"
                              value="No"
                              checked={field.value === "No"}
                              className="form-radio h-5 w-5 text-blue-600 focus:ring focus:ring-blue-500"
                            />
                            <span className="text-sm dark:text-gray-300 text-gray-700">
                              No
                            </span>
                          </label>
                        </div>
                        {error && (
                          <span className="text-red-500 text-sm">
                            {error.message}
                          </span>
                        )}
                      </div>
                    )}
                  />
                  <Controller
                    name="FullHDRecording"
                    control={control}
                    defaultValue="Yes"
                    rules={{
                      required:
                        "Please select if Full HD Recording is available",
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          Full HD Recording
                        </label>
                        <div className="flex space-x-4 mt-2">
                          <label className="flex items-center space-x-2">
                            <input
                              {...field}
                              type="radio"
                              value="Yes"
                              checked={field.value === "Yes"}
                              className="form-radio h-5 w-5 text-blue-600 focus:ring focus:ring-blue-500"
                            />
                            <span className="text-sm dark:text-gray-300 text-gray-700">
                              Yes
                            </span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              {...field}
                              type="radio"
                              value="No"
                              checked={field.value === "No"}
                              className="form-radio h-5 w-5 text-blue-600 focus:ring focus:ring-blue-500"
                            />
                            <span className="text-sm dark:text-gray-300 text-gray-700">
                              No
                            </span>
                          </label>
                        </div>
                        {error && (
                          <span className="text-red-500 text-sm">
                            {error.message}
                          </span>
                        )}
                      </div>
                    )}
                  />
                  <Controller
                    name="VideoRecording"
                    control={control}
                    defaultValue="Yes"
                    rules={{
                      required: "Please select if Video Recording is available",
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          Video Recording
                        </label>
                        <div className="flex space-x-4 mt-2">
                          <label className="flex items-center space-x-2">
                            <input
                              {...field}
                              type="radio"
                              value="Yes"
                              checked={field.value === "Yes"}
                              className="form-radio h-5 w-5 text-blue-600 focus:ring focus:ring-blue-500"
                            />
                            <span className="text-sm dark:text-gray-300 text-gray-700">
                              Yes
                            </span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              {...field}
                              type="radio"
                              value="No"
                              checked={field.value === "No"}
                              className="form-radio h-5 w-5 text-blue-600 focus:ring focus:ring-blue-500"
                            />
                            <span className="text-sm dark:text-gray-300 text-gray-700">
                              No
                            </span>
                          </label>
                        </div>
                        {error && (
                          <span className="text-red-500 text-sm">
                            {error.message}
                          </span>
                        )}
                      </div>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Conditionally Render Fields Based on Category */}
            {selectedCategory?.toLowerCase() === "electronics" && (
              <>
                <h1 className="  text-[20px] font-normal font-serif">
                  Electronics Details Fields
                </h1>
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    name="processor"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          Processor
                        </label>
                        <input
                          {...field}
                          type="text"
                          className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300"
                          placeholder="Enter processor"
                        />
                      </div>
                    )}
                  />
                  <Controller
                    name="ram"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          RAM
                        </label>
                        <input
                          {...field}
                          type="text"
                          className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300"
                          placeholder="Enter RAM"
                        />
                      </div>
                    )}
                  />
                  <Controller
                    name="storage"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          Storage
                        </label>
                        <input
                          {...field}
                          type="text"
                          className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300"
                          placeholder="Enter storage"
                        />
                      </div>
                    )}
                  />
                  <Controller
                    name="resolution"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          Resolution
                        </label>
                        <input
                          {...field}
                          type="text"
                          className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300"
                          placeholder="Enter resolution (e.g., 3216 x 1440 pixels)"
                        />
                      </div>
                    )}
                  />
                  <Controller
                    name="batteryLife"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          Battery Life
                        </label>
                        <input
                          {...field}
                          type="text"
                          className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300"
                          placeholder="Enter battery life"
                        />
                      </div>
                    )}
                  />
                  <Controller
                    name="warranty"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          warranty
                        </label>
                        <input
                          {...field}
                          type="text"
                          className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300"
                          placeholder="Enter warranty"
                        />
                      </div>
                    )}
                  />
                </div>
              </>
            )}

            {selectedCategory?.toLowerCase() === "Fashion" && (
              <>
                <div className="mt-4">
                  <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                    Sizes
                  </label>
                  {sizeFields.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 mt-2"
                    >
                      <Controller
                        name={`size.${index}`}
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300"
                            placeholder="Enter size"
                          />
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => removeSize(index)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => appendSize("")}
                    className="mt-2 text-blue-500 hover:text-blue-600 flex items-center"
                  >
                    <FaPlus className="mr-2" /> Add Size
                  </button>
                </div>
              </>
            )}

            {selectedCategory?.toLowerCase() === "furniture" && (
              <>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <Controller
                    name="dimensions.length"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          Length (cm)
                        </label>
                        <input
                          {...field}
                          type="number"
                          className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300"
                          placeholder="Enter length"
                        />
                      </div>
                    )}
                  />
                  <Controller
                    name="dimensions.width"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          Width (cm)
                        </label>
                        <input
                          {...field}
                          type="number"
                          className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300"
                          placeholder="Enter width"
                        />
                      </div>
                    )}
                  />
                  <Controller
                    name="dimensions.height"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                          Height (cm)
                        </label>
                        <input
                          {...field}
                          type="number"
                          className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300"
                          placeholder="Enter height"
                        />
                      </div>
                    )}
                  />
                </div>
              </>
            )}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
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
                            className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
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
              <div className="">
                <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                  Colors
                </label>
                {colorFields.map((item, index) => (
                  <div key={item.id} className="flex items-center space-x-4 ">
                    <Controller
                      name={`color.${index}`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300"
                          placeholder="Enter color"
                        />
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => removeColor(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => appendColor("")}
                  className="mt-2 text-blue-500 hover:text-blue-600 flex items-center"
                >
                  <FaPlus className="mr-2" /> Add Color
                </button>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                Features
              </label>
              {featuresFields.map((item, index) => (
                <div key={item.id} className="flex items-center space-x-4 mt-2">
                  <Controller
                    name={`features.${index}`}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300"
                        placeholder="Enter features"
                      />
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => removeFeatures(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => appendFeatures("")}
                className="mt-2 text-blue-500 hover:text-blue-600 flex items-center"
              >
                <FaPlus className="mr-2" /> Add Features
              </button>
            </div>
            <div className="mt-4">
              <h1 className="text-[20px] font-normal font-serif dark:text-gray-300">
                General Specifications
              </h1>
              {generalSpecificationFields.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center w-full gap-4  mt-2"
                >
                  <div className="flex  gap-x-4 w-full">
                    {/* Specification Key */}

                    <Controller
                      name={`generalSpecifications.${index}.key`}
                      control={control}
                      rules={{ required: "Specification key is required" }}
                      render={({ field, fieldState: { error } }) => (
                        <div className="w-full">
                          <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                            Specification Name
                          </label>
                          <input
                            {...field}
                            type="text"
                            className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
                              error ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="e.g., Display Size"
                          />
                          {error && (
                            <span className="text-red-500 text-sm">
                              {error.message}
                            </span>
                          )}
                        </div>
                      )}
                    />

                    {/* Specification Value */}
                    <Controller
                      name={`generalSpecifications.${index}.value`}
                      control={control}
                      rules={{ required: "Specification value is required" }}
                      render={({ field, fieldState: { error } }) => (
                        <div className="w-full">
                          <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                            Specification Value
                          </label>
                          <input
                            {...field}
                            type="text"
                            className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
                              error ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="e.g., 108 cm (43 inches)"
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
                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeSpecification(index)}
                    className="text-red-500 hover:text-red-600 mt-4"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}

              {/* Add Specification Button */}
              <button
                type="button"
                onClick={() => appendSpecification({ key: "", value: "" })}
                className="mt-2 text-blue-500 hover:text-blue-600 flex items-center"
              >
                <FaPlus className="mr-2" /> Add Specification
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="discount.startDate"
                control={control}
                rules={{ required: "Discount start date is required" }}
                render={({ field, fieldState: { error } }) => (
                  <div>
                    <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                      Discount Start Date
                    </label>
                    <input
                      {...field}
                      type="date"
                      className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
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
                    <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                      Discount End Date
                    </label>
                    <input
                      {...field}
                      type="date"
                      className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
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
                    <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                      Discount Percentage
                    </label>
                    <input
                      {...field}
                      type="number"
                      className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
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
                    <label className="block text-sm dark:text-gray-300 font-medium text-gray-700">
                      Discount Amount
                    </label>
                    <input
                      {...field}
                      type="number"
                      className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${
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
    </Modal>
  );
};

export default AddProductModal;
