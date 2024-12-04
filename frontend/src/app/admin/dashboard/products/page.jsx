"use client";

import React, { useState } from "react";
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

const ProductsListPage = () => {
  const [products, setProducts] = useState([
    {
      _id: "674d53902fdacb99194c24b4",
      name: "Shirt product",
      description: "This is a Shirt product.",
      price: 400,
      category: "Cloths",
      brand: "Popcorn",
      stock: 50,
      images: [
        {
          url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop",
          alt: "Front view",
        },
        {
          url: "https://plus.unsplash.com/premium_photo-1677541205130-51e60e937318?q=80&w=2128&auto=format&fit=crop",
          alt: "Side view",
        },
      ],
      discount: {
        percentage: 5,
        amount: 50,
        startDate: "2024-12-01T00:00:00.000Z",
        endDate: "2024-12-10T00:00:00.000Z",
        isActive: true,
      },
    },
    {
      _id: "674d3f85c118238a9eebb7a8",
      name: "Example Product",
      description: "This is an example product.",
      price: 100,
      category: "Electronics",
      brand: "Apple",
      stock: 50,
      images: [
        {
          url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop",
          alt: "Front view",
        },
        {
          url: "https://plus.unsplash.com/premium_photo-1677541205130-51e60e937318?q=80&w=2128&auto=format&fit=crop",
          alt: "Side view",
        },
      ],
      discount: {
        percentage: 10,
        amount: 0,
        startDate: "2024-12-01T00:00:00.000Z",
        endDate: "2024-12-09T00:00:00.000Z",
        isActive: true,
      },
    },
  ]);

  const [filteredProducts, setFilteredProducts] = useState(products);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const recordsPerPage = 5;

  const uniqueCategories = [
    ...new Set(products.map((product) => product.category)),
  ];
  const uniqueBrands = [...new Set(products.map((product) => product.brand))];

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
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    applyFilters(query, selectedCategory, selectedBrand);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    applyFilters(searchQuery, category, selectedBrand);
  };

  const handleBrandChange = (e) => {
    const brand = e.target.value;
    setSelectedBrand(brand);
    applyFilters(searchQuery, selectedCategory, brand);
  };

  const applyFilters = (query, category, brand) => {
    let filtered = products;

    if (query) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query)
      );
    }

    if (category) {
      filtered = filtered.filter((product) => product.category === category);
    }

    if (brand) {
      filtered = filtered.filter((product) => product.brand === brand);
    }

    setFilteredProducts(filtered);
  };

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const toggleExpandRow = (productId) => {
    setExpandedRow(expandedRow === productId ? null : productId);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setAddProductModalOpen(true);
  };

  const handleDelete = (productId) => {
    const updatedProducts = products.filter(
      (product) => product._id !== productId
    );
    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts);
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
              {uniqueCategories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select
              value={selectedBrand}
              onChange={handleBrandChange}
              className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="">All Brands</option>
              {uniqueBrands.map((brand, index) => (
                <option key={index} value={brand}>
                  {brand}
                </option>
              ))}
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
              {paginatedProducts.map((product) => (
                <React.Fragment key={product._id}>
                  <tr
                    className="border-t hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleExpandRow(product._id)}
                  >
                    <td className="p-4">{product.name}</td>
                    <td className="p-4">{product.category}</td>
                    <td className="p-4">{product.brand}</td>
                    <td className="p-4">${product.price}</td>
                    <td className="p-4">
                      {product.discount.isActive
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
                            <strong>Description:</strong> {product.description}
                          </p>
                          <p>
                            <strong>Stock:</strong> {product.stock}
                          </p>
                          <p>
                            <strong>Discount Details:</strong>{" "}
                            {product.discount.isActive
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
