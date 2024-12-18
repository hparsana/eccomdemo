"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { FaStar } from "react-icons/fa";

const ReviewModal = ({ open, review, onClose, onSubmit }) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: review || {
      rating: 0,
      comment: "",
    },
  });

  const handleAdd = () => {
    reset();
    onClose();
  };

  React.useEffect(() => {
    if (review) {
      reset(review); // Populate form with review data when modal opens
    }
  }, [review, reset]);

  if (!open) return null;

  const StarRating = ({ field, error }) => {
    const [hover, setHover] = React.useState(null);

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Rating
        </label>
        <div className="flex space-x-1 mt-2">
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;

            return (
              <label key={index}>
                <input
                  type="radio"
                  value={ratingValue}
                  {...field}
                  className="hidden"
                />
                <FaStar
                  size={24}
                  className={`cursor-pointer ${
                    ratingValue <= (hover || field.value)
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => field.onChange(ratingValue)}
                />
              </label>
            );
          })}
        </div>
        {error && <span className="text-red-500 text-sm">{error.message}</span>}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      {/* Modal Container */}
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Add/Edit Review
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit(handleAdd)} className="space-y-6">
          {/* Rating */}
          <Controller
            name="rating"
            control={control}
            rules={{
              required: "Rating is required",
              min: {
                value: 1,
                message: "Rating cannot be less than 1",
              },
              max: {
                value: 5,
                message: "Rating cannot be more than 5",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StarRating field={field} error={error} />
            )}
          />

          {/* Comment */}
          <Controller
            name="comment"
            control={control}
            rules={{ required: "Comment is required" }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Comment
                </label>
                <textarea
                  {...field}
                  className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none ${
                    error ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your comment"
                  rows={4}
                />
                {error && (
                  <span className="text-red-500 text-sm">{error.message}</span>
                )}
              </div>
            )}
          />

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;