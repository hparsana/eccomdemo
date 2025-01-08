"use client";

import React, { useEffect } from "react";
import { Modal } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import {
  addCategory,
  updateCategory,
  getAllCategories,
} from "@/app/store/Category/categoryApi";

const AddCategoryModal = ({ open, category, onClose }) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
    },
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (category) {
      reset(category);
    }
  }, [category, reset]);

  const handleFormSubmit = async (data) => {
    try {
      if (category) {
        await dispatch(
          updateCategory({ id: category._id, categoryData: data })
        );
      } else {
        await dispatch(addCategory(data));
      }

      dispatch(getAllCategories());
      onClose();
    } catch (error) {
      alert(`Failed to ${category ? "update" : "add"} category: ${error}`);
    }
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="add-category-modal">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-lg shadow-lg relative p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            {category ? "Edit Category" : "Add Category"}
          </h2>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <Controller
              name="name"
              control={control}
              rules={{ required: "Category name is required" }}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category Name
                  </label>
                  <input
                    {...field}
                    type="text"
                    className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none ${
                      error
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200`}
                    placeholder="Enter category name"
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
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    {...field}
                    rows="3"
                    className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    placeholder="Enter description"
                  ></textarea>
                </div>
              )}
            />
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-700 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none"
              >
                {category ? "Update Category" : "Add Category"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default AddCategoryModal;
