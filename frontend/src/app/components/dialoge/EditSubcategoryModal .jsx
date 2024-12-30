"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { Modal } from "@mui/material";
import {
  updateSubcategory,
  addSubcategory,
  getAllCategories,
} from "@/app/store/Category/categoryApi";

const EditSubcategoryModal = ({
  open,
  subcategory,
  categoryId,
  onClose,
  mode = "edit", // "edit" or "add"
}) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: mode === "edit" ? subcategory?.name || "" : "",
      description: mode === "edit" ? subcategory?.description || "" : "",
    },
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (mode === "edit" && subcategory) {
      reset({
        name: subcategory.name || "",
        description: subcategory.description || "",
      });
    } else if (mode === "add") {
      reset({
        name: "",
        description: "",
      });
    }
  }, [mode, subcategory, reset]);

  const onSubmit = async (data) => {
    try {
      if (mode === "edit") {
        console.log("come in edit");

        // Update subcategory
        await dispatch(
          updateSubcategory({
            categoryId,
            subcategoryId: subcategory._id,
            subcategoryData: data,
          })
        ).unwrap();
        // Fetch updated categories list after deletion
        dispatch(getAllCategories());
      } else {
        // Add subcategory
        console.log("come in add");

        await dispatch(
          addSubcategory({
            categoryId,
            subcategoryData: data,
          })
        ).unwrap();
        // Fetch updated categories list after deletion
        dispatch(getAllCategories());
      }
      onClose();
    } catch (error) {
      console.error(`Failed to ${mode} subcategory:`, error);
    }
  };

  if (!open) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby={`${mode}-subcategory-modal`}
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-bold mb-4">
            {mode === "edit" ? "Edit Subcategory" : "Add Subcategory"}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              name="name"
              control={control}
              rules={{ required: "Subcategory name is required" }}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    {...field}
                    type="text"
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 ${
                      error ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter subcategory name"
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
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    {...field}
                    rows="3"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Enter subcategory description"
                  ></textarea>
                </div>
              )}
            />
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
                {mode === "edit" ? "Save" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default EditSubcategoryModal;
