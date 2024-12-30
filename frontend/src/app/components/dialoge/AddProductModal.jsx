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
      generalSpecifications: product?.generalSpecifications || [
        { key: "", value: "" },
      ], // Initialize as array of objects
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
        <div className="bg-white w-full max-w-5xl rounded-lg shadow-lg relative p-6 overflow-y-auto max-h-[95vh]">
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
                    <label className="block text-sm font-medium text-gray-700">
                      original Price
                    </label>
                    <input
                      {...field}
                      type="number"
                      className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none ${
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

            <div className="grid grid-cols-3 gap-4">
              <Controller
                name="category"
                control={control}
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      {...field}
                      className="w-full px-4 py-2 border rounded-md"
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
                    <label className="block text-sm font-medium text-gray-700">
                      Subcategory
                    </label>
                    <select
                      {...field}
                      className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none ${
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
                        <label className="block text-sm font-medium text-gray-700">
                          Processor
                        </label>
                        <input
                          {...field}
                          type="text"
                          className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none border-gray-300"
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
                        <label className="block text-sm font-medium text-gray-700">
                          RAM
                        </label>
                        <input
                          {...field}
                          type="text"
                          className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none border-gray-300"
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
                        <label className="block text-sm font-medium text-gray-700">
                          Storage
                        </label>
                        <input
                          {...field}
                          type="text"
                          className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none border-gray-300"
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
                        <label className="block text-sm font-medium text-gray-700">
                          Resolution
                        </label>
                        <input
                          {...field}
                          type="text"
                          className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none border-gray-300"
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
                        <label className="block text-sm font-medium text-gray-700">
                          Battery Life
                        </label>
                        <input
                          {...field}
                          type="text"
                          className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none border-gray-300"
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
                        <label className="block text-sm font-medium text-gray-700">
                          warranty
                        </label>
                        <input
                          {...field}
                          type="text"
                          className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none border-gray-300"
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
                  <label className="block text-sm font-medium text-gray-700">
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
                            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none border-gray-300"
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
                        <label className="block text-sm font-medium text-gray-700">
                          Length (cm)
                        </label>
                        <input
                          {...field}
                          type="number"
                          className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none border-gray-300"
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
                        <label className="block text-sm font-medium text-gray-700">
                          Width (cm)
                        </label>
                        <input
                          {...field}
                          type="number"
                          className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none border-gray-300"
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
                        <label className="block text-sm font-medium text-gray-700">
                          Height (cm)
                        </label>
                        <input
                          {...field}
                          type="number"
                          className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none border-gray-300"
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
              <div className="">
                <label className="block text-sm font-medium text-gray-700">
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
                          className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none border-gray-300"
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
              <label className="block text-sm font-medium text-gray-700">
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
                        className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none border-gray-300"
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
              <h1 className="text-[20px] font-normal font-serif">
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
                          <label className="block text-sm font-medium text-gray-700">
                            Specification Name
                          </label>
                          <input
                            {...field}
                            type="text"
                            className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none ${
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
                          <label className="block text-sm font-medium text-gray-700">
                            Specification Value
                          </label>
                          <input
                            {...field}
                            type="text"
                            className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none ${
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
    </Modal>
  );
};

export default AddProductModal;
