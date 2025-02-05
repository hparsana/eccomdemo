import {
  addReview,
  getProductById,
  updateReview,
} from "@/app/store/Product/productApi";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { FaStar } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const ReviewModal = ({ open, review, onClose, productId }) => {
  const dispatch = useDispatch();
  const { control, handleSubmit, reset } = useForm({
    defaultValues: review || {
      rating: 0,
      comment: "",
    },
  });

  const handleAdd = (data) => {
    const dataAll = { ...data, rating: parseFloat(data.rating) };
    const action = review?._id
      ? updateReview({ productId, reviewId: review._id, reviewData: dataAll })
      : addReview({ productId, reviewData: dataAll });

    dispatch(action)
      .then((response) => {
        if (response.error) {
          toast.error(response.payload || "Failed to submit review.");
          return;
        }
        toast.success("Review submitted successfully!");
        dispatch(getProductById(productId)); // Refresh product details
        reset();
        onClose();
      })
      .catch((error) => {
        toast.error("An error occurred while submitting the review.");
        console.error("Failed to add/edit review:", error);
      });
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
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 px-3">
      <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          {review ? "Edit Review" : "Add Review"}
        </h2>

        <form onSubmit={handleSubmit(handleAdd)} className="space-y-6">
          {/* Star Rating */}
          <Controller
            name="rating"
            control={control}
            rules={{
              required: "Rating is required",
              min: { value: 1, message: "Rating cannot be less than 1" },
              max: { value: 5, message: "Rating cannot be more than 5" },
            }}
            render={({ field, fieldState: { error } }) => (
              <StarRating field={field} error={error} />
            )}
          />

          {/* Comment Field */}
          <Controller
            name="comment"
            control={control}
            rules={{ required: "Comment is required" }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Comment
                </label>
                <textarea
                  {...field}
                  className={`w-full px-4 py-2 border rounded-md focus:ring focus:outline-none 
                dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 
                ${error ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
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
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {review ? "Editing your review." : "Share your honest feedback."}
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 
              focus:outline-none focus:ring dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 
              focus:outline-none focus:ring focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
