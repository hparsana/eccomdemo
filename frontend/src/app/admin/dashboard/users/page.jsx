"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pagination } from "@mui/material";
import {
  FaEdit,
  FaTrashAlt,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaSearch,
  FaThLarge,
  FaTable,
} from "react-icons/fa";
import withAuth from "@/app/components/Auth/withAuth";
import EditUserModal from "@/app/components/dialoge/EditUserModal";
import { getAllUsers } from "@/app/store/User/userApi";
import useAxios from "@/app/utils/commonAxios";
import { toast } from "react-toastify";
import { downloadUserPDF } from "./DownloadUserPDF";
import axios from "axios";
import { USERS } from "@/app/utils/constant";

const UserList = () => {
  const dispatch = useDispatch();
  const { userList, totalUsers, totalPages, currentPage, loading } =
    useSelector((state) => state.userData);
  const { darkMode } = useSelector((state) => state.userAuthData);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState("table"); // "table" or "card"
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [downloadGeneratePdf, setDownloadGeneratePdf] = useState({
    state: false,
    title: "Download User List",
  });
  const recordsPerPage = 5;

  useEffect(() => {
    dispatch(getAllUsers({ page: 1, limit: recordsPerPage }));
  }, [dispatch]);

  useEffect(() => {
    const filtered = userList.filter(
      (user) =>
        user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [userList, searchTerm]);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleDelete = (userId) => {
    alert(`Delete user with ID: ${userId}`);
  };

  const handlePageChange = (event, page) => {
    dispatch(getAllUsers({ page, limit: recordsPerPage }));
  };

  const sortUsers = (column) => {
    const newSortOrder =
      sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(newSortOrder);

    const sorted = [...filteredUsers].sort((a, b) => {
      if (newSortOrder === "asc") {
        return a[column] > b[column] ? 1 : -1;
      } else {
        return a[column] < b[column] ? 1 : -1;
      }
    });

    setFilteredUsers(sorted);
  };
  const fetchAllUsersForPDF = async () => {
    try {
      setDownloadGeneratePdf({
        state: true,
        title: "Collecting Data...",
      });
      const token = localStorage.getItem("accessToken");

      const response = await axios.get(USERS.GET_ALL_USERS, {
        params: { limit: 100000 },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        setDownloadGeneratePdf({
          state: true,
          title: "generating Pdf...",
        });
        downloadUserPDF(response?.data?.data?.users); // Generate PDF with all users
        setDownloadGeneratePdf({
          state: false,
          title: "Download User List",
        });
      } else {
        setDownloadGeneratePdf({
          state: false,
          title: "Download User List",
        });
        console.error("Failed to fetch all users for PDF.");
      }
    } catch (error) {
      setDownloadGeneratePdf({
        state: false,
        title: "Download User List",
      });
      console.error("Error fetching all users for PDF:", error);
    }
  };
  const getSortIcon = (column) => {
    if (sortColumn !== column) return <FaSort />;
    return sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-bold p-6 bg-slate-400 dark:bg-gray-900 text-white">
        User List
      </h1>

      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl hidden md:block font-semibold dark:text-gray-300">
            User List
          </h2>

          <div className="flex md:justify-end md:w-auto  justify-between  gap-x-5">
            <button
              onClick={fetchAllUsersForPDF}
              disabled={downloadGeneratePdf.state}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 truncate"
            >
              {downloadGeneratePdf.title}
            </button>

            <div className="relative md:w-80 w-auto">
              <input
                type="text"
                placeholder="Search users..."
                className="w-full px-4 py-2 border rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* View Toggle Icon */}
            <button
              onClick={() =>
                setViewMode(viewMode === "table" ? "card" : "table")
              }
              className="bg-gray-500 text-white px-4 py-2 w-auto rounded-lg hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-300"
            >
              {viewMode === "table" ? (
                <FaThLarge size={20} />
              ) : (
                <FaTable size={20} />
              )}
            </button>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : viewMode === "table" ? (
          // **TABLE VIEW**
          <div className="overflow-x-auto max-w-[100vw] -mx-6 px-5">
            <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg dark:bg-gray-800 dark:border-gray-700">
              <thead className="bg-gray-200 dark:bg-gray-700">
                <tr>
                  <th className="p-4 text-left text-gray-600 dark:text-gray-300">
                    Full Name
                  </th>
                  <th className="p-4 text-left text-gray-600 dark:text-gray-300">
                    Email
                  </th>
                  <th
                    className="p-4 text-left text-gray-600 dark:text-gray-300 cursor-pointer"
                    onClick={() => sortUsers("role")}
                  >
                    <div className="flex items-center">
                      Role {getSortIcon("role")}
                    </div>
                  </th>
                  <th className="p-4 text-center text-gray-600 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-t hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="p-4 text-gray-800 dark:text-gray-300">
                      {user.fullname}
                    </td>
                    <td className="p-4 text-gray-800 dark:text-gray-300">
                      {user.email}
                    </td>
                    <td className="p-4 text-gray-800 dark:text-gray-300">
                      {user.role}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-yellow-500 hover:text-yellow-600"
                        >
                          <FaEdit size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <FaTrashAlt size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // **CARD VIEW**
          <div className="grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-6 ">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="bg-white dark:bg-gray-800 shadow-lg rounded-xl md:p-6 p-3 flex flex-col space-y-4 transition-transform transform hover:scale-105 hover:shadow-xl duration-300 ease-in-out"
              >
                {/* Action Buttons - Positioned at the Top Right */}

                {/* User Details - Avatar & Info Section */}
                <div className="flex items-start flex-wrap gap-4 w-full">
                  {/* User Avatar with Initials */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold uppercase shadow-md">
                    {user.fullname.charAt(0)}
                  </div>

                  {/* User Information */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold dark:text-white truncate w-full">
                      {user.fullname}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-300 text-sm truncate w-full">
                      {user.email}
                    </p>
                    <div className="flex justify-start mt-2 w-full">
                      <span className="px-4 py-1 text-sm font-semibold rounded-full bg-gray-100 dark:bg-gray-700 dark:text-gray-300 text-gray-800 uppercase tracking-wide truncate">
                        {user.role}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end  space-x-4">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-yellow-500 hover:text-yellow-600 transition-colors duration-200"
                    >
                      <FaEdit size={22} />
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-500 hover:text-red-600 transition-colors duration-200"
                    >
                      <FaTrashAlt size={22} />
                    </button>
                  </div>
                </div>

                {/* Role Badge - Positioned Responsively */}
              </div>
            ))}
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
                color: darkMode ? "white" : "black",
                borderColor: darkMode ? "#6b7280" : "#d1d5db",
                backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                "&:hover": {
                  backgroundColor: darkMode ? "#374151" : "#f3f4f6",
                },
              },
              "& .Mui-selected": {
                color: "#ffffff",
                borderColor: darkMode ? "#10b981" : "#2563eb",
                backgroundColor: darkMode ? "#10b981" : "#2563eb",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: darkMode ? "#059669" : "#1d4ed8",
                },
              },
            }}
          />
        </div>
      </div>

      <EditUserModal open={open} user={selectedUser} onClose={handleClose} />
    </div>
  );
};

export default UserList;
