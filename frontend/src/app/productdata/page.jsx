"use client";
import { useEffect, useRef, useState } from "react";
import productData from "../components/product";
const { products, facets } = productData.data;
import { FaHeart } from "react-icons/fa";
import { FaFilter, FaTimes } from "react-icons/fa";
import { motion, useInView } from "framer-motion";
import { Slider } from "@mui/material";
import { redirect } from "next/navigation";

export default function ProductData() {
  const [priceRange, setPriceRange] = useState([200, 250000]);
  const [selectedStock, setSelectedStock] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [showSidebar, setShowSidebar] = useState(false); // Toggle sidebar on small screens

  // Filter products dynamically
  const filteredProducts = products.filter((product) => {
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesStock = !selectedStock || product.stock < 10;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "" || product.category === selectedCategory;
    const matchesBrand =
      selectedBrand === "" || product.brand === selectedBrand;
    const matchesColor =
      selectedColor === "" || product.color?.includes(selectedColor);
    const matchesSize =
      selectedSize === "" || product.size?.includes(selectedSize);

    return (
      matchesPrice &&
      matchesStock &&
      matchesSearch &&
      matchesCategory &&
      matchesBrand &&
      matchesColor &&
      matchesSize
    );
  });

  const handleResetFilter = () => {
    setPriceRange([0, 250000]);
    setSelectedStock(false);
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedBrand("");
    setSelectedColor("");
    setSelectedSize("");
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  return (
    <div className="bg-gray-50">
      <div className="lg:w-[90%] md:w-[95%] w-full mx-auto min-h-[80vh] flex flex-col md:flex-row gap-6 mt-6">
        {/* Sidebar Toggle Button (Small Screens) */}
        <div className="flex justify-between items-center md:hidden px-4">
          <button
            onClick={() => setShowSidebar(true)}
            className="text-blue-500 text-lg flex items-center"
          >
            <FaFilter className="mr-2" /> Filter
          </button>
        </div>

        {/* Sidebar */}
        <aside
          className={`fixed md:relative bg-white shadow-sm rounded-lg p-4 z-40 top-0 left-0 h-full md:min-h-[100vh] lg:w-1/6 md:w-1/4 sm:w-[40%] w-[250px]  transform ${
            showSidebar ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-300 ease-in-out`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Filters</h3>

            <div className=" flex justify-end items-center">
              <button
                onClick={handleResetFilter}
                className="text-blue-600 text-sm underline md:mr-0 mr-5"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowSidebar(false)}
                className="text-red-500 text-[25px] md:hidden"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Clear All Filters */}

          {/* Filters */}
          <div className="mb-6">
            <label className="block font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border rounded-md p-2 focus:outline-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border rounded-md p-2"
            >
              <option value="">All</option>
              {facets.categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label className="block font-medium text-gray-700 mb-2">
              Brand
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full border rounded-md p-2"
            >
              <option value="">All</option>
              {facets.brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-between items-center gap-x-2">
            {selectedCategory === "Footwear" && (
              <div className="mb-6 w-full">
                <label className="block font-medium text-gray-700 mb-2">
                  Size
                </label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full border rounded-md p-2"
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
            {selectedCategory === "Footwear" ||
            selectedCategory === "Electronics" ? (
              <div className="mb-6 w-full">
                <label className="block font-medium text-gray-700 mb-2">
                  Color
                </label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full border rounded-md p-2"
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
            ) : null}
          </div>
          <div className="mb-6">
            <label className="block font-medium text-gray-700 mb-2">
              Price Range:{" "}
            </label>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={250000}
              step={100}
              // marks={[
              //   { value: 0, label: "₹0" },
              //   { value: 250000, label: "₹250,000" },
              // ]}
              className=""
            />
            <div className="flex justify-between  items-center">
              <h4 className="font-normal">₹{priceRange[0]}</h4>
              <h4 className="font-normal">₹{priceRange[1]}</h4>
            </div>
          </div>
          <div>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedStock}
                onChange={() => setSelectedStock(!selectedStock)}
                className="form-checkbox h-4 w-4 text-blue-500"
              />
              <span className="ml-2 text-gray-700 font-medium">
                Only Few Left
              </span>
            </label>
          </div>
        </aside>

        {/* Product Listing */}
        <div className="grid grid-cols-1  sm:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-6 md:px-0 px-3 mb-5 flex-1">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600">
              No products match your filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }) {
  const [like, setLike] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  useEffect(() => {
    const likedProducts =
      JSON.parse(localStorage.getItem("likedProducts")) || [];
    const isLiked = likedProducts.some((item) => item._id === product._id);
    setLike(isLiked);
  }, [product._id]);

  const handleLike = () => {
    const likedProducts =
      JSON.parse(localStorage.getItem("likedProducts")) || [];

    if (like) {
      const updatedLikes = likedProducts.filter(
        (item) => item._id !== product._id
      );
      localStorage.setItem("likedProducts", JSON.stringify(updatedLikes));
      setLike(false);
    } else {
      const updatedLikes = [...likedProducts, product];
      localStorage.setItem("likedProducts", JSON.stringify(updatedLikes));
      setLike(true);
    }
  };
  const handleCardClick = () => {
    redirect(`/productdata/${product?._id}`);
  };
  return (
    <motion.div
      ref={ref}
      className="relative bg-white shadow-md rounded-lg overflow-hidden h-fit md:min-h-[410px] hover:shadow-lg transition-shadow duration-300 cursor-pointer"
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
              className={`w-6 h-6 ${like ? "text-red-500" : "text-gray-300"} cursor-pointer`}
              onClick={handleLike}
            />
          </div>
        </div>

        <div className="p-4" onClick={handleCardClick}>
          <h2 className="text-lg font-semibold text-gray-800 truncate">
            {product.name}
          </h2>
          <p className="text-sm text-gray-600 truncate">
            {product.description}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xl font-bold text-gray-900">
              ₹{product.price}
            </span>
            <span className="text-sm text-gray-500 line-through">
              ₹{product.originalPrice}
            </span>
            <span className="text-sm font-bold text-green-600">
              {product.discount}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">{product.delivery}</p>
          {product.size && (
            <p className="text-sm text-gray-600 mt-2">
              Available Sizes: {product.size.join(", ")}
            </p>
          )}
          {product.color && (
            <p className="text-sm text-gray-600 mt-2">
              Available Colors: {product.color.join(", ")}
            </p>
          )}
          {product.stock < 10 && (
            <p className="text-sm text-red-600 mt-1 font-semibold">
              Only few left
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
