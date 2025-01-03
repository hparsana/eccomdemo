"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link"; // Import Next.js Link for navigation
import { useDispatch, useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import { getAllCategories } from "../store/Category/categoryApi";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Import arrow icons
import SubcategoryLink from "./SubcategoryLink";
import { useSearchParams } from "next/navigation";
import { getAllProducts } from "../store/Product/productApi";
export function NavbarDemo() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar />
    </div>
  );
}

function Navbar() {
  const [active, setActive] = useState(null);

  // Fetch categories and subcategories dynamically
  const {
    categoryList: categories,
    loading,
    error,
  } = useSelector((state) => state.categoryData);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);
  const searchParams = useSearchParams();

  useEffect(() => {
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");

    if (category && subcategory) {
      dispatch(
        getAllProducts({
          category: category,
          subcategory: subcategory,
        })
      );
    }
  }, [searchParams]); // Trigger useEffect when searchParams change

  const handleMouseEnter = (category) => {
    setActive(category);
  };

  const handleMouseLeave = () => {
    setActive(null);
  };

  return (
    <div className="w-full bg-white shadow-md z-50">
      <nav className="container mx-auto flex items-center justify-around px-6 py-4">
        {/* Show loading state */}
        {loading && <p>Loading categories...</p>}

        {/* Error handling */}
        {error && <p className="text-red-500">Error: {error}</p>}

        {/* Display categories dynamically */}
        {categories?.map((category) => (
          <div
            key={category._id}
            className="group relative cursor-pointer"
            onMouseEnter={() => handleMouseEnter(category.name)}
            onMouseLeave={handleMouseLeave}
          >
            {/* Category Name */}
            <span className="font-medium text-[14px] text-gray-700 hover:text-blue-600 transition-colors duration-200 flex items-center">
              {category.name}
              {active === category.name ? (
                <FaChevronUp className="ml-2 text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-200" />
              ) : (
                <FaChevronDown className="ml-2 text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-200" />
              )}
            </span>

            {/* Dropdown (Subcategories) */}
            <div
              className={cn(
                "absolute left-1/2 transform -translate-x-1/2 bg-white shadow-xl border border-gray-200 mt-2 rounded-lg duration-300", // Centered dropdown
                active === category.name
                  ? "opacity-100 scale-100 translate-y-0 visible"
                  : "opacity-0 scale-95 translate-y-2 invisible"
              )}
              style={{ minWidth: "300px", maxWidth: "800px" }}
            >
              <div className="grid grid-cols-2 gap-3 p-3">
                {category.subcategories?.length > 0 ? (
                  category.subcategories.map((subcategory) => (
                    <SubcategoryLink
                      key={subcategory._id}
                      category={category.name}
                      subcategory={subcategory.name}
                    />
                  ))
                ) : (
                  <p className="text-gray-500">No subcategories available</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}
