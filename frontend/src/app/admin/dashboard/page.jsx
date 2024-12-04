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
} from "react-icons/fa";
import withAuth from "@/app/components/Auth/withAuth";
import EditUserModal from "@/app/components/dialoge/EditUserModal";
import { getAllUsers } from "@/app/store/User/userApi";
import useAxios from "@/app/utils/commonAxios";
import { toast } from "react-toastify";
import { USERS } from "@/app/utils/constant";

const DashBoard = () => {
  const dispatch = useDispatch();
  const { userList, totalUsers, totalPages, currentPage, loading } =
    useSelector((state) => state.userData);

  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [open, setOpen] = useState(false); // Modal open/close state
  const [selectedUser, setSelectedUser] = useState(null); // Selected user for editing
  const [avatarColors, setAvatarColors] = useState([]); // Avatar background colors
  const axios = useAxios();
  const recordsPerPage = 5; // Records per page

  useEffect(() => {
    dispatch(getAllUsers({ page: 1, limit: recordsPerPage })); // Fetch initial user data
  }, [dispatch]);

  useEffect(() => {
    // Generate random colors for each user
    const getRandomColor = () => {
      const colors = [
        "bg-red-500",
        "bg-blue-500",
        "bg-green-500",
        "bg-yellow-500",
        "bg-purple-500",
        "bg-pink-500",
        "bg-indigo-500",
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    setAvatarColors(userList.map(() => getRandomColor()));
  }, [userList]); // Re-run when `userList` changes

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
    // Implement delete functionality
  };

  const handleSubmit = async (data) => {
    try {
      const res = await axios.put(
        `${USERS.UPDATE_USER_INFO_BYADMIN}/${data._id}`,
        data
      );
      console.log("res is<<", res);

      if (res?.data?.success) {
        toast.success("User Update Successfully!");

        dispatch(getAllUsers({ page: 1, limit: recordsPerPage })); // Fetch initial user data

        setOpen(false);
      } else {
        toast.error(res?.data?.message || "something is wrong");
      }
      //   reset();
    } catch (error) {
      toast.error(error.response.data.message || "something is wrong");
      return;
    }
  };

  const sortUsers = (column) => {
    const newSortOrder =
      sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(newSortOrder);

    // Implement sorting logic if needed
  };

  const getSortIcon = (column) => {
    if (sortColumn !== column) return <FaSort />;
    return sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  const handlePageChange = (event, page) => {
    dispatch(getAllUsers({ page, limit: recordsPerPage })); // Fetch data for the selected page
  };

  return (
    <div>
      <h1 className="text-2xl font-bold p-6 bg-slate-400 text-white">
        Dashboard
      </h1>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">User List</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-4 text-left text-gray-600">Avatar</th>
                  <th
                    className="p-4 text-left text-gray-600 flex items-center cursor-pointer"
                    onClick={() => sortUsers("fullname")}
                  >
                    Full Name {getSortIcon("fullname")}
                  </th>
                  <th className="p-4 text-left text-gray-600">Email</th>
                  <th
                    className="p-4 text-left text-gray-600 flex items-center cursor-pointer"
                    onClick={() => sortUsers("role")}
                  >
                    Role {getSortIcon("role")}
                  </th>
                  <th className="p-4 text-center text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {userList.map((user, index) => (
                  <tr key={user._id} className="border-t hover:bg-gray-50">
                    <td className="p-4">
                      <div
                        className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-lg ${
                          avatarColors[index] || "bg-gray-500"
                        }`}
                      >
                        {user.fullname.charAt(0)}
                      </div>
                    </td>
                    <td className="p-4">{user.fullname}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{user.role}</td>
                    <td className="p-4 text-center flex justify-center space-x-4">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-end items-center mt-4">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
            color="primary"
          />
        </div>
      </div>

      {/* Edit User Modal */}
      <EditUserModal
        open={open}
        user={selectedUser}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default DashBoard;
