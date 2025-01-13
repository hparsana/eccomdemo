"use client";
import { useEffect, useRef, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { FaFilter, FaTimes } from "react-icons/fa";
import { motion, useInView } from "framer-motion";
import { Slider } from "@mui/material";
import { redirect, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../store/Product/productApi";
import { NavbarDemo } from "./NavbarMid";
import {
  fetchSavedProducts,
  saveProduct,
  unsaveProduct,
} from "@/app/store/SaveProduct/savedProductApi";
import { ResetProducts } from "../store/Product/product.slice";
import { toggleDarkMode } from "../store/Auth/auth.slice";

export default function ProductData() {
  const [priceRange, setPriceRange] = useState([0, 250000]);
  const [selectedStock, setSelectedStock] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [showSidebar, setShowSidebar] = useState(false); // Toggle sidebar on small screens
  const [freeShipping, setFreeShipping] = useState(false);
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedDiscount, setSelectedDiscount] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [debouncedPriceRange, setDebouncedPriceRange] = useState([200, 250000]);
  const {
    productList: products,
    totalProducts,
    totalPages,
    facets,
    currentPage,
    loading,
    error,
  } = useSelector((state) => state.productData);
  const { userLoggedIn, darkMode } = useSelector((state) => state.userAuthData);

  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const recordsPerPage = 5;
  const lastCalled = useRef(0);
  useEffect(() => {
    return () => {
      dispatch(ResetProducts());
    };
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm); // Update debounced term after delay
    }, 500); // Adjust debounce delay as needed (e.g., 300ms, 500ms)

    return () => {
      clearTimeout(handler); // Clear timeout if the value changes before delay
    };
  }, [searchTerm]);
  // Debouncing for Price Range
  useEffect(() => {
    // dispatch(ResetProducts());
    const handler = setTimeout(() => {
      const queryParams = {
        page: currentPage,
        limit: recordsPerPage,
        ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
        ...(selectedCategory && { category: selectedCategory }),
        ...(selectedBrand && { brand: selectedBrand }),
        ...(priceRange[0] && { minPrice: priceRange[0] }),
        ...(priceRange[1] && { maxPrice: priceRange[1] }),
      };

      dispatch(getAllProducts(queryParams));
    }, 300); // Debounce delay for price range and other updates

    return () => {
      clearTimeout(handler);
    }; // Clear the timeout if dependencies change
  }, [
    debouncedSearchTerm,
    priceRange,
    selectedCategory,
    selectedBrand,
    currentPage,
    dispatch,
  ]);

  useEffect(() => {
    const fetchFilteredProducts = () => {
      const now = Date.now();
      if (now - lastCalled.current < 600) return; // Avoid multiple calls within 500ms
      lastCalled.current = now;

      const queryParams = {
        page: currentPage || 1,
        limit: recordsPerPage || 10,
      };

      if (debouncedSearchTerm) queryParams.search = debouncedSearchTerm;
      if (selectedCategory) queryParams.category = selectedCategory;
      if (selectedBrand) queryParams.brand = selectedBrand;
      if (debouncedPriceRange[0]) queryParams.minPrice = debouncedPriceRange[0];
      if (debouncedPriceRange[1]) queryParams.maxPrice = debouncedPriceRange[1];

      // dispatch(getAllProducts(queryParams));
    };

    fetchFilteredProducts();
  }, [
    selectedCategory,
    selectedBrand,
    currentPage,
    debouncedSearchTerm,
    // debouncedPriceRange,
    dispatch,
  ]);

  useEffect(() => {
    dispatch(fetchSavedProducts());
  }, [dispatch, userLoggedIn]);

  // Filter products dynamically
  const filteredProducts = loading
    ? []
    : products.filter((product) => {
        console.log(product);

        // Color Filter
        const matchesColor =
          selectedColor === "" ||
          product.color?.some((color) =>
            color.toLowerCase().includes(selectedColor.toLowerCase())
          );

        // Size Filter
        const matchesSize =
          selectedSize === "" ||
          product.size?.some((size) =>
            size.toLowerCase().includes(selectedSize.toLowerCase())
          );

        // Rating Filter
        const matchesRating =
          selectedRating === "" || product.rating >= parseInt(selectedRating);

        // Free Shipping Filter
        const matchesFreeShipping =
          !freeShipping || product.shippingDetails?.isFreeShipping;

        // Discount Filter
        const matchesDiscount =
          selectedDiscount === "" ||
          (product.discount?.percentage &&
            product.discount.percentage >= parseInt(selectedDiscount));

        // Stock Filter
        const matchesStock =
          !selectedStock || (product.stock && product.stock < 10);

        // Combine all filters
        return (
          matchesColor &&
          matchesSize &&
          matchesRating &&
          matchesFreeShipping &&
          matchesDiscount &&
          matchesStock
        );
      });

  const handleResetFilter = () => {
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    if (
      (category && subcategory) ||
      priceRange[0] !== 0 ||
      priceRange[1] !== 250000 ||
      selectedStock ||
      searchTerm ||
      selectedCategory ||
      selectedBrand ||
      selectedColor ||
      selectedSize
    ) {
      setPriceRange([0, 250000]);
      setSelectedStock(false);
      setSearchTerm("");
      setSelectedCategory("");
      setSelectedBrand("");
      setSelectedColor("");
      setSelectedSize("");
      redirect("/productdata");
    }
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen smooth-transition">
      <div className="md:block hidden">
        <NavbarDemo />
      </div>
      <div className="lg:w-[90%] md:w-[95%] w-full mx-auto min-h-[80vh] flex flex-col md:flex-row gap-6 mt-6">
        {/* Sidebar Toggle Button (Small Screens) */}
        <div className="flex justify-between items-center md:hidden px-4">
          <button
            onClick={() => setShowSidebar(true)}
            className="text-blue-500 dark:text-blue-400 text-lg flex items-center"
          >
            <FaFilter className="mr-2" /> Filter
          </button>
        </div>

        {/* Sidebar */}
        <aside
          className={`fixed md:relative bg-white dark:bg-gray-800 smooth-transition shadow-sm rounded-lg p-4 z-40 top-0 left-0 h-[100vh] md:min-h-[100vh] md:overflow-hidden overflow-y-scroll lg:w-1/6 md:w-1/4 sm:w-[40%] w-[250px] transform ${
            showSidebar ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-300 ease-in-out`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              Filters
            </h3>

            <div className="flex justify-end items-center">
              <button
                onClick={handleResetFilter}
                className="text-blue-600 dark:text-blue-400 text-sm underline md:mr-0 mr-5"
              >
                Clear All
              </button>
              <button
                onClick={() => dispatch(toggleDarkMode())}
                className="p-2 bg-gray-200 dark:bg-gray-700 rounded"
              >
                {darkMode ? "Dark" : "Light"}
              </button>
              <button
                onClick={() => setShowSidebar(false)}
                className="text-red-500 dark:text-red-400 text-[25px] md:hidden"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border rounded-md p-2 focus:outline-blue-500 dark:focus:outline-blue-400 bg-gray-50 dark:bg-gray-700 smooth-transition text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="mb-6">
            <label className="block font-medium text-gray-700  dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedBrand("");
                setSelectedColor("");
                setSelectedSize("");
              }}
              className="w-full border rounded-md p-2 bg-gray-50 dark:bg-gray-700 smooth-transition text-gray-900 dark:text-gray-100"
            >
              <option value="">All</option>
              {facets?.categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">
              Brand
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full border rounded-md p-2 bg-gray-50 dark:bg-gray-700 smooth-transition text-gray-900 dark:text-gray-100"
            >
              <option value="">All</option>
              {facets?.brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-between items-center gap-x-2">
            {selectedCategory === "Shoes" && (
              <div className="mb-6 w-full">
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Size
                </label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full border rounded-md p-2 bg-gray-50 dark:bg-gray-700 smooth-transition text-gray-900 dark:text-gray-100"
                >
                  <option value="">All</option>
                  {Array.from(
                    new Set(products.flatMap((p) => p.size || []))
                  ).map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {(selectedCategory === "Shoes" ||
              selectedCategory === "Electronics") && (
              <div className="mb-6 w-full">
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color
                </label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full border rounded-md p-2 bg-gray-50 dark:bg-gray-700 smooth-transition text-gray-900 dark:text-gray-100"
                >
                  <option value="">All</option>
                  {Array.from(
                    new Set(products.flatMap((p) => p.color || []))
                  ).map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="mb-6">
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price Range
            </label>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={250000}
              step={100}
              className="dark:text-gray-100"
            />
            <div className="flex justify-between items-center">
              <h4 className="font-normal text-gray-700 dark:text-gray-300">
                ₹{priceRange[0]}
              </h4>
              <h4 className="font-normal text-gray-700 dark:text-gray-300">
                ₹{priceRange[1]}
              </h4>
            </div>
          </div>
          <div className="mb-6">
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">
              Discount
            </label>
            <select
              value={selectedDiscount}
              onChange={(e) => setSelectedDiscount(e.target.value)}
              className="w-full border rounded-md p-2 bg-gray-50 dark:bg-gray-700 smooth-transition text-gray-900 dark:text-gray-100"
            >
              <option value="">All</option>
              <option value="10">10% or more</option>
              <option value="20">20% or more</option>
              <option value="30">30% or more</option>
              <option value="50">50% or more</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rating
            </label>
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="w-full border rounded-md p-2 bg-gray-50 dark:bg-gray-700 smooth-transition text-gray-900 dark:text-gray-100"
            >
              <option value="">All</option>
              <option value="1">1 Star & above</option>
              <option value="2">2 Stars & above</option>
              <option value="3">3 Stars & above</option>
              <option value="4">4 Stars & above</option>
              <option value="5">5 Stars</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={freeShipping}
                onChange={() => setFreeShipping(!freeShipping)}
                className="form-checkbox h-4 w-4 text-blue-500 dark:text-blue-400"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300 font-medium">
                Free Shipping
              </span>
            </label>
          </div>
          <div className="md:mb-0 mb-20">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedStock}
                onChange={() => setSelectedStock(!selectedStock)}
                className="form-checkbox h-4 w-4 text-blue-500 dark:text-blue-400"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300 font-medium">
                Only Few Left
              </span>
            </label>
          </div>
        </aside>

        {/* Product Listing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 md:gap-y-0 gap-y-3 md:mb-16 mb-28 md:px-0 px-3 flex-1">
          {loading ? (
            <div className="col-span-full flex justify-center items-center">
              <div className="w-16 h-16 border-4 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600 dark:text-gray-300">
              No products found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProductCard({ product, onRemove }) {
  const [like, setLike] = useState(false); // Local like state
  const dispatch = useDispatch();

  const savedProducts = useSelector(
    (state) => state.savedProductData.savedProducts
  ); // Access Redux state
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  // Initialize "like" status from Redux state
  useEffect(() => {
    const isLiked = savedProducts.some((item) => item._id === product._id);
    setLike(isLiked);
  }, [savedProducts, product._id]);

  // Handle Like/Unlike
  const handleLike = () => {
    if (like) {
      dispatch(unsaveProduct(product._id)); // Remove from Redux
    } else {
      dispatch(saveProduct(product)); // Add to Redux
    }
    setLike(!like); // Toggle local state
  };

  const handleCardClick = () => {
    redirect(`/productdata/${product?._id}`);
  };

  return (
    <motion.div
      ref={ref}
      className="relative bg-white dark:bg-gray-800 smooth-transition shadow-md rounded-lg mt-5  h-fit md:min-h-[410px] hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="relative">
        <div className="relative">
          <img
            src={product.images[0]?.url}
            alt={product.images[0]?.alt}
            className="w-full h-52 object-cover"
            onClick={handleCardClick}
          />
          <div className="absolute top-2 right-2">
            <FaHeart
              className={`w-6 h-6 ${like ? "text-red-500" : "text-gray-300 smooth-transition dark:text-gray-500 "} cursor-pointer`}
              onClick={handleLike}
            />
          </div>
        </div>

        <div className="p-4" onClick={handleCardClick}>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
            {product.name}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
            {product.description}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
              ₹{product.price}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
              ₹{product.originalPrice}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            {product.delivery}
          </p>
          {product.size?.length !== 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Available Sizes: {product.size.join(", ")}
            </p>
          )}
          {product.color && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Available Colors: {product.color.join(", ")}
            </p>
          )}
          {product.ram && product.ram !== "N/A" && (
            <div className="flex gap-x-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                Ram: {product.ram}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                Storage: {product.storage}
              </p>
            </div>
          )}
          {product.stock < 10 && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1 font-semibold">
              Only few left
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
