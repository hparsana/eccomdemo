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

  const {
    productList: products,
    totalProducts,
    totalPages,
    currentPage,
    loading,
    error,
  } = useSelector((state) => state.productData);

  const dispatch = useDispatch();

  const recordsPerPage = 5;

  useEffect(() => {
    dispatch(
      getAllProducts({
        page: currentPage,
        limit: recordsPerPage,
      })
    );
  }, [dispatch, currentPage]);
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

      // Filter by selected brand
      if (selectedBrand) {
        filtered = filtered.filter(
          (product) => product.brand === selectedBrand
        );
      }

      setFilteredProducts(filtered);
    };

    applyFilters();
  }, [searchQuery, selectedCategory, selectedBrand, products]);

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
    setCurrentPage(page);
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

  return (
    <div>
      <h1 className="text-2xl font-bold p-6 bg-slate-400 text-white">
        Products List
      </h1>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Available Products</h2>
          <button
            onClick={() => setAddProductModalOpen(true)}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Add Product
          </button>
        </div>
        <div className="flex justify-between space-x-4 mb-4">
          <div className="flex space-x-4">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="">All Categories</option>
              {[...new Set(products?.map((product) => product.category))].map(
                (category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                )
              )}
            </select>
            <select
              value={selectedBrand}
              onChange={handleBrandChange}
              className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
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
          </div>
          <div className="relative w-80">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearch}
              className="border border-gray-300 px-4 py-2 pl-10 w-full rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
            <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-4 text-left text-gray-600">Name</th>
                  <th className="p-4 text-left text-gray-600">Category</th>
                  <th className="p-4 text-left text-gray-600">Brand</th>
                  <th
                    className="p-4 text-left text-gray-600 cursor-pointer flex items-center"
                    onClick={() => sortProducts("price")}
                  >
                    Price {getSortIcon("price")}
                  </th>
                  <th className="p-4 text-left text-gray-600">Discount</th>
                  <th className="p-4 text-center text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <React.Fragment key={product._id}>
                    <tr
                      className="border-t hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleExpandRow(product._id)}
                    >
                      <td className="p-4">{product.name}</td>
                      <td className="p-4">{product.category}</td>
                      <td className="p-4">{product.brand}</td>
                      <td className="p-4">₹{product.price}</td>
                      <td className="p-4">
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
                      <tr className="border-t bg-gray-100">
                        <td colSpan="6" className="p-4">
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
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex justify-end items-center mt-4">
          <Pagination
            count={Math.ceil(filteredProducts.length / recordsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
            color="primary"
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
