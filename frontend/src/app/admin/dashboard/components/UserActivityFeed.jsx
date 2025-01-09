import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Pagination } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getUserActivity } from "@/app/store/User/userApi";

const UserActivityFeed = () => {
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const itemsPerPage = 4; // Items per page
  const { userActivity, userActivityTotalPages } = useSelector(
    (state) => state.userData
  );
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch user activity based on current page and items per page
    dispatch(getUserActivity({ page: currentPage, limit: itemsPerPage }));
  }, [dispatch, currentPage]);

  const handlePageChange = (event, page) => {
    setCurrentPage(page); // Update the current page
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
        User Activity Feed
      </h3>
      <ul className="space-y-3">
        {userActivity?.map((activity) => (
          <li
            key={activity?._id}
            className="p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition border-gray-300 dark:border-gray-700"
          >
            <p className="font-medium text-gray-700 dark:text-gray-300">
              {activity?.action} By {activity?.user?.fullname}
            </p>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(new Date(activity?.timestamp), {
                addSuffix: true,
              })}
            </span>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="flex justify-end items-center mt-4">
        <Pagination
          count={userActivityTotalPages} // Total number of pages
          page={currentPage} // Current active page
          onChange={handlePageChange} // Change handler
          variant="outlined"
          shape="rounded"
          color="primary"
          className="dark:text-gray-300 dark:bg-gray-800 dark:border-gray-700"
        />
      </div>
    </motion.div>
  );
};

export default UserActivityFeed;
