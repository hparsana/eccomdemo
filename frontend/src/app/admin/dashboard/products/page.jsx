"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pagination } from "@mui/material";
import {
  FaEdit,
  FaTrashAlt,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaSearch,
} from "react-icons/fa";
import AddProductModal from "@/app/components/dialoge/AddProductModal";
import { deleteProduct, getAllProducts } from "@/app/store/Product/productApi";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { getAllCategories } from "@/app/store/Category/categoryApi";
import { downloadProductPDF } from "./DownloadProductPDF";
import { PRODUCTS } from "@/app/utils/constant";
const ProductsListPage = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [downloadGeneratePdf, setDownloadGeneratePdf] = useState({
    state: false,
    title: "Download PDF",
  });
  const {
    productList: products,
    totalProducts,
    totalPages,
    currentPage,
    loading,
    error,
  } = useSelector((state) => state.productData);
  const { categoryList: categories } = useSelector(
    (state) => state.categoryData
  );
  const { darkMode } = useSelector((state) => state.userAuthData);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);
  const recordsPerPage = 5;

  useEffect(() => {
    dispatch(
      getAllProducts({
        page: 1,
        limit: recordsPerPage,
      })
    );
  }, [dispatch]);
  useEffect(() => {
    const applyFilters = () => {
      let filtered = products;

      // Filter by search query
      if (searchQuery) {
        filtered = filtered.filter(
          (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Filter by selected category
      if (selectedCategory) {
        filtered = filtered.filter(
          (product) => product.category === selectedCategory
        );
      }

      // Filter by selected subcategory
      if (selectedSubcategory) {
        filtered = filtered.filter(
          (product) => product.subcategory === selectedSubcategory
        );
      }

      // Filter by selected brand
      if (selectedBrand) {
        filtered = filtered.filter(
          (product) => product.brand === selectedBrand
        );
      }

      setFilteredProducts(filtered);
    };

    applyFilters();
  }, [
    searchQuery,
    selectedCategory,
    selectedSubcategory,
    selectedBrand,
    products,
  ]);

  const HandleResetData = () => {
    setSortColumn(null);
    setSortOrder("asc");
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedBrand("");
    setSelectedSubcategory("");
    setExpandedRow(null);
  };

  const sortProducts = (column) => {
    const newSortOrder =
      sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(newSortOrder);

    const sortedProducts = [...filteredProducts].sort((a, b) => {
      if (newSortOrder === "asc") {
        return a[column] > b[column] ? 1 : -1;
      } else {
        return a[column] < b[column] ? 1 : -1;
      }
    });
    setFilteredProducts(sortedProducts);
  };

  const getSortIcon = (column) => {
    if (sortColumn !== column) return <FaSort />;
    return sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  const handlePageChange = (event, page) => {
    dispatch(
      getAllProducts({
        page,
        limit: recordsPerPage,
      })
    );
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
  };

  const toggleExpandRow = (productId) => {
    setExpandedRow(expandedRow === productId ? null : productId);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setAddProductModalOpen(true);
  };

  const handleDelete = async (productId) => {
    await dispatch(deleteProduct(productId)).unwrap();
    dispatch(
      getAllProducts({
        page: currentPage,
      })
    );
  };
  const fetchAllUsersForPDF = async () => {
    try {
      setDownloadGeneratePdf({
        state: true,
        title: "Collecting Data...",
      });
      const response = await axios.post(
        PRODUCTS.GET_ALL_PRODUCTS,
        {},
        {
          params: {
            limit: 100000,
          },
        }
      );

      if (response.data.success) {
        setDownloadGeneratePdf({
          state: true,
          title: "generating Pdf...",
        });
        downloadProductPDF(response?.data?.data?.products); // Generate PDF with all users
        setDownloadGeneratePdf({
          state: false,
          title: "Download PDF",
        });
      } else {
        setDownloadGeneratePdf({
          state: false,
          title: "Download PDF",
        });
        console.error("Failed to fetch all users for PDF.");
      }
    } catch (error) {
      setDownloadGeneratePdf({
        state: false,
        title: "Download PDF",
      });
      console.error("Error fetching all users for PDF:", error);
    }
  };
  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-bold p-6 bg-slate-400 dark:bg-gray-900 text-white">
        Products List
      </h1>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold hidden md:block dark:text-gray-300">
            Available Products
          </h2>
          <div className="flex flex-wrap md:w-auto w-[100%] md:justify-end justify-between gap-x-2">
            <button
              onClick={() => fetchAllUsersForPDF()}
              disabled={downloadGeneratePdf.state}
              className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300 truncate"
            >
              {downloadGeneratePdf.title}
            </button>
            <button
              onClick={() => setAddProductModalOpen(true)}
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Add Product
            </button>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          {/* Filters Left Section */}
          <div className="flex flex-col sm:flex-row gap-4 flex-grow">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full sm:w-auto border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
            >
              <option value="">All Categories</option>
              {categories?.map((datas) => (
                <option value={datas?.name} key={datas?._id}>
                  {datas?.name}
                </option>
              ))}
            </select>

            {/* Subcategory Filter */}
            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              className="w-full sm:w-auto border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              disabled={!selectedCategory}
            >
              <option value="">All Subcategories</option>
              {categories
                ?.find((category) => category.name === selectedCategory)
                ?.subcategories.map((subcategory) => (
                  <option value={subcategory.name} key={subcategory._id}>
                    {subcategory.name}
                  </option>
                ))}
            </select>

            {/* Brand Filter */}
            <select
              value={selectedBrand}
              onChange={handleBrandChange}
              className="w-full sm:w-auto border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
            >
              <option value="">All Brands</option>
              {[...new Set(products?.map((product) => product.brand))].map(
                (brand, index) => (
                  <option key={index} value={brand}>
                    {brand}
                  </option>
                )
              )}
            </select>

            {/* Reset Button */}
            <button
              onClick={HandleResetData}
              className="w-full sm:w-auto px-4 py-2 text-blue-700 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>

          {/* Search Right Section */}
          <div className="w-full md:w-80 relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full border border-gray-300 px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
            />
            <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className=" overflow-x-auto max-w-[100vw] -mx-6 px-6">
            <table className="w-full bg-white border border-gray-200 shadow-md rounded-lg dark:bg-gray-800 dark:border-gray-700">
              <thead className="bg-gray-200 dark:bg-gray-700">
                <tr>
                  <th className="p-4 text-left text-gray-600 dark:text-gray-300">
                    Name
                  </th>
                  <th className="p-4 text-left text-gray-600 dark:text-gray-300">
                    Category
                  </th>
                  <th className="p-4 text-left text-gray-600 dark:text-gray-300">
                    Brand
                  </th>
                  <th
                    className="p-4 text-left text-gray-600 dark:text-gray-300 cursor-pointer flex items-center"
                    onClick={() => sortProducts("price")}
                  >
                    Price {getSortIcon("price")}
                  </th>
                  <th className="p-4 text-left text-gray-600 dark:text-gray-300">
                    Discount
                  </th>
                  <th className="p-4 text-center text-gray-600 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <React.Fragment key={product._id}>
                    <tr
                      className="border-t hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => toggleExpandRow(product._id)}
                    >
                      <td className="p-4 dark:text-gray-200">{product.name}</td>
                      <td className="p-4 dark:text-gray-200">
                        {product.category}
                      </td>
                      <td className="p-4 dark:text-gray-200">
                        {product.brand}
                      </td>
                      <td className="p-4 dark:text-gray-200">
                        ₹{product.price}
                      </td>
                      <td className="p-4 dark:text-gray-200">
                        {product.discount?.isActive
                          ? `${product.discount.percentage}% off`
                          : "No Discount"}
                      </td>
                      <td className="p-4 text-center flex justify-center space-x-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(product);
                          }}
                          className="text-yellow-500 hover:text-yellow-600"
                        >
                          <FaEdit size={20} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(product._id);
                          }}
                          className="text-red-500 hover:text-red-600"
                        >
                          <FaTrashAlt size={20} />
                        </button>
                      </td>
                    </tr>
                    {expandedRow === product._id && (
                      <AnimatePresence>
                        <motion.tr
                          className="border-t bg-gray-100 dark:bg-gray-700 dark:border-gray-600"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <td colSpan="6" className="p-4 dark:text-gray-300">
                            <div>
                              <p>
                                <strong>Description:</strong>{" "}
                                {product.description}
                              </p>
                              <p>
                                <strong>Stock:</strong> {product.stock}
                              </p>
                              <p>
                                <strong>Discount Details:</strong>{" "}
                                {product.discount?.isActive
                                  ? `${product.discount.percentage}% off, valid from ${new Date(
                                      product.discount.startDate
                                    ).toLocaleDateString()} to ${new Date(
                                      product.discount.endDate
                                    ).toLocaleDateString()}`
                                  : "No Discount"}
                              </p>
                              <div className="flex mt-2 space-x-4">
                                {product.images.map((img, index) => (
                                  <img
                                    key={index}
                                    src={img.url}
                                    alt={img.alt}
                                    className="w-20 h-20 rounded-lg object-cover"
                                  />
                                ))}
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      </AnimatePresence>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex justify-end items-center mt-4">
          <Pagination
            count={totalPages}
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
      </div>
      {addProductModalOpen && (
        <AddProductModal
          open={addProductModalOpen}
          product={selectedProduct}
          onClose={() => {
            setAddProductModalOpen(false);
            setSelectedProduct(null);
          }}
          onSubmit={(data) => {
            if (selectedProduct) {
              const updatedProducts = products.map((p) =>
                p._id === selectedProduct._id ? { ...p, ...data } : p
              );
              setProducts(updatedProducts);
            } else {
              const newProduct = { ...data, _id: Date.now().toString() };
              setProducts([newProduct, ...products]);
            }
            setAddProductModalOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default ProductsListPage;
