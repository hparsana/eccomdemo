"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaEdit,
  FaTrashAlt,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaSearch,
  FaPlus,
} from "react-icons/fa";
import {
  getAllCategories,
  deleteCategory,
  deleteSubcategory,
} from "@/app/store/Category/categoryApi";
import AddCategoryModal from "@/app/components/dialoge/AddCategoryModal";
import { Pagination } from "@mui/material";
import EditSubcategoryModal from "@/app/components/dialoge/EditSubcategoryModal ";
import { downloadCategoryPDF } from "./downloadCategoryPDF";
import axios from "axios";
import { CATEGORIES } from "@/app/utils/constant";

const CategoriesListPage = () => {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
  const [addSubcategoryModalOpen, setAddSubcategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const {
    categoryList: categories,
    loading,
    error,
  } = useSelector((state) => state.categoryData);
  const { darkMode } = useSelector((state) => state.userAuthData);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  const sortCategories = (column) => {
    const newSortOrder =
      sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(newSortOrder);
  };

  const getSortIcon = (column) => {
    if (sortColumn !== column) return <FaSort />;
    return sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredCategories = categories?.filter((category) => {
    const matchesCategory = category.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesSubcategory = category.subcategories?.some((subcategory) =>
      subcategory.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return matchesCategory || matchesSubcategory;
  });

  const paginatedCategories = filteredCategories?.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setAddCategoryModalOpen(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    await dispatch(deleteCategory(categoryId)).unwrap();
    dispatch(getAllCategories());
  };

  const toggleExpandCategory = (categoryId) => {
    setExpandedCategoryId(
      expandedCategoryId === categoryId ? null : categoryId
    );
  };

  const handleAddSubcategory = (category) => {
    setSelectedCategory(category);
    setAddSubcategoryModalOpen(true);
  };

  const handleEditSubcategory = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setAddSubcategoryModalOpen(true);
  };

  const handleDeleteSubcategory = async (subcategoryId, categoryId) => {
    try {
      await dispatch(deleteSubcategory({ categoryId, subcategoryId })).unwrap();
      dispatch(getAllCategories());
    } catch (error) {
      console.error("Failed to delete subcategory:", error);
    }
  };
  const fetchAllCategoriesForPDF = async () => {
    try {
      const response = await axios.get(CATEGORIES.GET_ALL_CATEGORIES, {
        params: { limit: 100000 }, // Fetch all categories
      });

      if (response.data.success) {
        downloadCategoryPDF(response?.data?.data);
      } else {
        console.error("Failed to fetch categories for PDF.");
      }
    } catch (error) {
      console.error("Error fetching categories for PDF:", error);
    }
  };
  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-bold p-6 bg-slate-400 dark:bg-gray-900 text-white">
        Category List
      </h1>
      <div className="p-6 h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold dark:text-gray-300">
            Available Categories
          </h2>
          <div className="flex gap-x-5">
            <button
              onClick={() => fetchAllCategoriesForPDF()}
              className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
            >
              Download Category PDF
            </button>

            <button
              onClick={() => setAddCategoryModalOpen(true)}
              className="flex items-center bg-blue-500  text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Add Category
            </button>
          </div>
        </div>
        <div className="relative w-80 mb-4">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={handleSearch}
            className="border border-gray-300 px-4 py-2 pl-10 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-300  dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
          />
          <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg dark:bg-gray-800 dark:border-gray-700">
              <thead className="bg-gray-200 dark:bg-gray-700">
                <tr>
                  <th
                    className="p-4 text-left text-gray-600 dark:text-gray-300 cursor-pointer flex items-center"
                    onClick={() => sortCategories("name")}
                  >
                    Name <span>{getSortIcon("name")} </span>
                  </th>
                  <th className="p-4 text-left text-gray-600 dark:text-gray-300">
                    Description
                  </th>
                  <th className="p-4 text-center text-gray-600 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedCategories?.map((category) => (
                  <React.Fragment key={category._id}>
                    <tr
                      className="border-t hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => toggleExpandCategory(category._id)}
                    >
                      <td className="p-4 text-gray-800 dark:text-gray-300">
                        {category.name}
                      </td>
                      <td className="p-4 text-gray-800 dark:text-gray-300">
                        {category.description}
                      </td>
                      <td className="p-4 text-center flex justify-center space-x-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditCategory(category);
                          }}
                          className="text-yellow-500 hover:text-yellow-600"
                        >
                          <FaEdit size={20} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(category._id);
                          }}
                          className="text-red-500 hover:text-red-600"
                        >
                          <FaTrashAlt size={20} />
                        </button>
                      </td>
                    </tr>
                    {expandedCategoryId === category._id && (
                      <tr>
                        <td
                          colSpan="3"
                          className="p-4 bg-gray-100 dark:bg-gray-700"
                        >
                          <ul>
                            <li className="p-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddSubcategory(category);
                                }}
                                className="text-blue-500 hover:text-blue-600 flex items-center"
                              >
                                <FaPlus className="mr-2" /> Add Subcategory
                              </button>
                            </li>
                            {category.subcategories?.length > 0 ? (
                              category.subcategories.map((subcategory) => (
                                <li
                                  key={subcategory._id}
                                  className="flex justify-between w-[300px] items-center p-2 border-b dark:border-gray-600"
                                >
                                  <span className="text-gray-700 font-semibold dark:text-gray-300">
                                    {subcategory.name}
                                  </span>
                                  <div className="flex space-x-4">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditSubcategory(subcategory);
                                      }}
                                      className="text-yellow-500 hover:text-yellow-600"
                                    >
                                      <FaEdit size={16} />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteSubcategory(
                                          subcategory._id,
                                          category._id
                                        );
                                      }}
                                      className="text-red-500 hover:text-red-600"
                                    >
                                      <FaTrashAlt size={16} />
                                    </button>
                                  </div>
                                </li>
                              ))
                            ) : (
                              <div className="flex items-center justify-between">
                                <p className="text-gray-700 dark:text-gray-300">
                                  No Subcategories Available
                                </p>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddSubcategory(category);
                                  }}
                                  className="text-blue-500 hover:text-blue-600 flex items-center"
                                >
                                  <FaPlus className="mr-2" /> Add Subcategory
                                </button>
                              </div>
                            )}
                          </ul>
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
            count={Math.ceil(filteredCategories?.length / recordsPerPage)}
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
        {addCategoryModalOpen && (
          <AddCategoryModal
            open={addCategoryModalOpen}
            category={selectedCategory}
            onClose={() => {
              setAddCategoryModalOpen(false);
              setSelectedCategory(null);
            }}
          />
        )}
        {addSubcategoryModalOpen && (
          <EditSubcategoryModal
            open={addSubcategoryModalOpen}
            mode={selectedSubcategory ? "edit" : "add"}
            subcategory={selectedSubcategory}
            categoryId={expandedCategoryId}
            onClose={() => {
              setAddSubcategoryModalOpen(false);
              setSelectedSubcategory(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CategoriesListPage;
