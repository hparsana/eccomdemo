"use client";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCompare,
  clearCompare,
} from "@/app/store/CompareProduct/compareProduct.slice";
import Image from "next/image";
import { FaStar, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import Link from "next/link";

const ComparePage = () => {
  const dispatch = useDispatch();
  const compareItems = useSelector((state) => state.compareData.compareItems);

  if (compareItems.length < 1)
    return (
      <p className="text-center mt-10 text-gray-700 dark:text-gray-300">
        No products selected for comparison.
      </p>
    );

  // Limit to max 2 products
  const displayedProducts = compareItems.slice(0, 2);

  const handleRemove = (id) => {
    dispatch(removeFromCompare(id));
    toast.info("Product removed from compare list.");
  };

  return (
    <div className="bg-gray-100 md:pb-0 pb-20 min-h-screen md:p-10 p-2 dark:bg-gray-900">
      <div className="max-w-[1200px] mx-auto bg-white md:p-6 p-3 rounded-lg shadow-lg dark:bg-gray-800">
        <div className="flex justify-between ">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
            Compare {displayedProducts.map((p) => p.name).join(" vs ")}
          </h2>
          {compareItems.length === 1 && (
            <Link
              href={"/productdata"}
              className="inline-flex items-center justify-center px-5 pb-2 text-sm font-medium rounded-lg shadow-lg 
             bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700
             dark:from-gray-800 dark:to-gray-900 dark:hover:from-gray-700 dark:hover:to-gray-800 
             transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Add Item
            </Link>
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {displayedProducts.length} items
        </p>

        <div className="grid grid-cols-2 md:gap-6 gap-3 border-b pb-6">
          {displayedProducts.map((product) => (
            <div
              key={product.id}
              className="relative bg-gray-50 p-4 rounded-lg shadow-md dark:bg-gray-700"
            >
              {/* Remove Button */}
              <button
                className="absolute top-3 right-3 bg-gray-300 p-2 rounded-full hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
                onClick={() => handleRemove(product.id)}
              >
                <FaTimes size={16} />
              </button>

              {/* Product Image */}
              <div className="flex md:justify-start justify-center md:flex-nowrap flex-wrap items-center md:gap-x-10 gap-x-5">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={150}
                  height={150}
                  className="rounded-lg w-[150px] h-[150px] object-cover"
                />

                <div className="md:mt-0 mt-5 text-start">
                  {/* Product Name */}
                  <h3 className="text-lg font-semibold  text-gray-800 dark:text-gray-200">
                    {product.name}
                  </h3>

                  {/* Product Price */}
                  <p className=" text-blue-600 dark:text-blue-400 font-bold text-lg mt-2">
                    ₹{product.price}
                  </p>
                  {product.originalPrice && (
                    <p className=" text-gray-500 dark:text-gray-400 line-through">
                      ₹{product.originalPrice}
                    </p>
                  )}

                  {/* Rating */}
                  <div className="flex  items-center mt-2">
                    <div className="bg-green-500 text-white px-2 py-1 rounded-md flex items-center">
                      <span className="text-sm">{product.rating || "0.0"}</span>
                      <FaStar className="ml-1 text-xs" />
                    </div>
                    <span className="ml-2 text-gray-600 dark:text-gray-300 text-sm">{`${product.reviews?.length || 0} Reviews`}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-300 mb-4">
            Ratings & Reviews
          </h3>

          <div className="grid grid-cols-2 md:gap-6 gap-3">
            {displayedProducts.map((product, index) => {
              // Find the highest-rated product
              const highestRatedProduct = displayedProducts.reduce(
                (prev, current) =>
                  (prev.rating || 0) > (current.rating || 0) ? prev : current
              );

              return (
                <div
                  key={product.id}
                  className="bg-gray-50 p-4 rounded-lg shadow-md dark:bg-gray-700 relative"
                >
                  {/* Highlight Most Sold Product Based on Rating */}
                  {product.id === highestRatedProduct.id && (
                    <span className="absolute top-2 right-2 bg-yellow-500 text-white dark:text-black px-2 py-1 text-xs font-semibold rounded-md">
                      🏆 Most Sold
                    </span>
                  )}

                  <div className="bg-green-500 text-white px-2 py-1 rounded-md flex items-center w-fit">
                    <span className="text-sm">{product.rating || "0.0"}</span>
                    <FaStar className="ml-1 text-xs" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                    {product.reviews?.length || 0} Reviews
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* General Features */}
        <div className="mt-6 border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-300 mb-4">
            Highlights
          </h3>
          <div className="grid grid-cols-2  md:gap-6 gap-3">
            {displayedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-gray-50 p-4 rounded-lg shadow-md dark:bg-gray-700"
              >
                <ul className="text-gray-600 dark:text-gray-300 text-sm space-y-1">
                  {product.features
                    ?.slice(0, 5)
                    .map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    )) || <li>No features listed</li>}
                </ul>
              </div>
            ))}
          </div>
        </div>
        {/* Variants Comparison */}
        <div className="mt-6 border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-300 mb-4">
            Variants
          </h3>
          <div className="grid grid-cols-2  md:gap-6 gap-3">
            {displayedProducts.map((product, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-lg shadow-md dark:bg-gray-700"
              >
                <p className="text-gray-800 dark:text-gray-300 font-medium">
                  Color:
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {product.color?.join(", ") || "N/A"}
                </p>
                <p className="text-gray-800 mt-3 dark:text-gray-300 font-medium">
                  Brand:
                </p>
                <p className="text-gray-600  dark:text-gray-300 text-sm">
                  {product?.brand || "N/A"}
                </p>
                {product?.subcategory === "Mobile Phones" && (
                  <div>
                    <p className="text-gray-800 dark:text-gray-300 font-medium mt-2">
                      Storage:
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {product.storage || "N/A"}
                    </p>
                    <p className="text-gray-800 dark:text-gray-300 font-medium mt-2">
                      RAM:
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {product.ram || "N/A"}
                    </p>
                    <p className="text-gray-800 dark:text-gray-300 font-medium mt-2">
                      Resolution:
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {product.resolution || "N/A"}
                    </p>
                    <p className="text-gray-800 dark:text-gray-300 font-medium mt-2">
                      Processor:
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {product.processor || "N/A"}
                    </p>
                    <p className="text-gray-800 dark:text-gray-300 font-medium mt-2">
                      Warranty:
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {product.warranty || "N/A"}
                    </p>
                  </div>
                )}

                {product?.category === "Shoes" && (
                  <div className="mt-3">
                    <p className="text-gray-800 dark:text-gray-300 font-medium">
                      Size:
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {product?.size?.join(", ") || "N/A"}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Variants Comparison */}
        <div className="mt-6 border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-300 mb-4">
            General Specifications
            {/* {console.log("product<<<<", displayedProducts)} */}
          </h3>
          <div className="grid grid-cols-2  md:gap-6 gap-3">
            {displayedProducts?.map(
              (product, index) =>
                product?.generalSpecifications?.length !== 0 && (
                  <div
                    className="bg-gray-50 p-4 rounded-lg shadow-md dark:bg-gray-700"
                    key={index}
                  >
                    {product?.generalSpecifications?.map(
                      (data, key) =>
                        product?.subcategory === "Mobile Phones" && (
                          <div key={key}>
                            <p className="text-gray-800 dark:text-gray-300 font-medium mt-2">
                              {data?.key}
                            </p>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                              {data?.value || "N/A"}
                            </p>
                          </div>
                        )
                    )}
                  </div>
                )
            )}
          </div>
        </div>
        {/* Variants Comparison */}
        <div className="mt-6 border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-300 mb-4">
            General Info
          </h3>
          <div className="grid grid-cols-2 md:gap-6 gap-3">
            {displayedProducts.map(
              (product, index) =>
                product?.subcategory === "Mobile Phones" && (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg shadow-md dark:bg-gray-700"
                  >
                    {/* General Section */}
                    <h4 className="text-md font-bold text-gray-900 dark:text-gray-200 mb-2">
                      General
                    </h4>
                    {[
                      { label: "In The Box", value: product.InTheBox || "N/A" },
                      {
                        label: "Model Number",
                        value: product.ModelNumber || "N/A",
                      },
                      {
                        label: "Model Name",
                        value: product.ModelName || "N/A",
                      },
                      { label: "SIM Type", value: product.SIMType || "N/A" },
                      {
                        label: "Hybrid SIM Slot",
                        value: product.HybridSimSlot || "Yes",
                      },
                      {
                        label: "Touchscreen",
                        value: product.Touchscreen || "Yes",
                      },
                      {
                        label: "OTG Compatible",
                        value: product.OTGCompatible || "Yes",
                      },
                      {
                        label: "Quick Charging",
                        value: product.QuickCharging || "Yes",
                      },
                    ].map((spec, key) => (
                      <div key={key}>
                        <p className="text-gray-800 dark:text-gray-300 font-medium">
                          {spec.label}:
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          {spec.value}
                        </p>
                      </div>
                    ))}

                    {/* Display Features */}
                    <h4 className="text-md font-bold text-gray-900 dark:text-gray-200 mt-4">
                      Display Features
                    </h4>
                    {[
                      {
                        label: "Display Size",
                        value: product.DisplaySize || "N/A",
                      },
                      {
                        label: "Resolution Type",
                        value: product.ResolutionType || "N/A",
                      },
                      { label: "GPU", value: product.GPU || "N/A" },
                      {
                        label: "Other Display Features",
                        value: product.OtherDisplayFeatures || "N/A",
                      },
                      {
                        label: "Display Type",
                        value: product.DisplayType || "N/A",
                      },
                      {
                        label: "HD Game Support",
                        value: product.HDGameSupport || "Yes",
                      },
                    ].map((spec, key) => (
                      <div key={key}>
                        <p className="text-gray-800 dark:text-gray-300 font-medium">
                          {spec.label}:
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          {spec.value}
                        </p>
                      </div>
                    ))}

                    {/* OS & Processor Features */}
                    <h4 className="text-md font-bold text-gray-900 dark:text-gray-200 mt-4">
                      OS & Processor Features
                    </h4>
                    {[
                      {
                        label: "Operating System",
                        value: product.OperatingSystem || "N/A",
                      },
                      {
                        label: "Processor Brand",
                        value: product.ProcessorBrand || "N/A",
                      },
                      {
                        label: "Processor Type",
                        value: product.ProcessorType || "N/A",
                      },
                      {
                        label: "Processor Core",
                        value: product.ProcessorCore || "N/A",
                      },
                      {
                        label: "Primary Clock Speed",
                        value: product.PrimaryClockSpeed || "N/A",
                      },
                      {
                        label: "Secondary Clock Speed",
                        value: product.SecondaryClockSpeed || "N/A",
                      },
                      {
                        label: "Operating Frequency",
                        value: product.OperatingFrequency || "N/A",
                      },
                    ].map((spec, key) => (
                      <div key={key}>
                        <p className="text-gray-800 dark:text-gray-300 font-medium">
                          {spec.label}:
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          {spec.value}
                        </p>
                      </div>
                    ))}

                    {/* Memory & Storage Features */}
                    <h4 className="text-md font-bold text-gray-900 dark:text-gray-200 mt-4">
                      Memory & Storage Features
                    </h4>
                    {[
                      {
                        label: "Internal Storage",
                        value: product.InternalStorage || "N/A",
                      },
                      { label: "RAM", value: product.RAM || "N/A" },
                      {
                        label: "Total Memory",
                        value: product.TotalMemory || "N/A",
                      },
                    ].map((spec, key) => (
                      <div key={key}>
                        <p className="text-gray-800 dark:text-gray-300 font-medium">
                          {spec.label}:
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          {spec.value}
                        </p>
                      </div>
                    ))}

                    {/* Camera Features */}
                    <h4 className="text-md font-bold text-gray-900 dark:text-gray-200 mt-4">
                      Camera Features
                    </h4>
                    {[
                      {
                        label: "Primary Camera",
                        value: product.PrimaryCamera || "N/A",
                      },
                      {
                        label: "Primary Camera Features",
                        value: product.PrimaryCameraFeatures || "N/A",
                      },
                      {
                        label: "Secondary Camera",
                        value: product.SecondaryCamera || "N/A",
                      },
                      {
                        label: "Video Recording Resolution",
                        value: product.VideoRecordingResolution || "N/A",
                      },
                      {
                        label: "Digital Zoom",
                        value: product.DigitalZoom || "N/A",
                      },
                      {
                        label: "Frame Rate",
                        value: product.FrameRate || "N/A",
                      },
                      {
                        label: "Dual Camera Lens",
                        value: product.DualCameraLens || "N/A",
                      },
                      {
                        label: "Optical Zoom",
                        value: product.OpticalZoom || "Yes",
                      },
                      {
                        label: "Secondary Camera Available",
                        value: product.SecondaryCameraAvailable || "Yes",
                      },
                      { label: "Flash", value: product.Flash || "Yes" },
                      {
                        label: "HD Recording",
                        value: product.HDRecording || "Yes",
                      },
                      {
                        label: "Full HD Recording",
                        value: product.FullHDRecording || "Yes",
                      },
                      {
                        label: "Video Recording",
                        value: product.VideoRecording || "Yes",
                      },
                    ].map((spec, key) => (
                      <div key={key}>
                        <p className="text-gray-800 dark:text-gray-300 font-medium">
                          {spec.label}:
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          {spec.value}
                        </p>
                      </div>
                    ))}
                  </div>
                )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparePage;
