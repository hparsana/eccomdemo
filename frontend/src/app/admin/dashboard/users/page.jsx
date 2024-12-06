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
} from "react-icons/fa";
import withAuth from "@/app/components/Auth/withAuth";
import EditUserModal from "@/app/components/dialoge/EditUserModal";
import { getAllUsers } from "@/app/store/User/userApi";
import useAxios from "@/app/utils/commonAxios";
import { toast } from "react-toastify";

const UserList = () => {
  const dispatch = useDispatch();
  const { userList, totalUsers, totalPages, currentPage, loading } =
    useSelector((state) => state.userData);

  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

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

  const getSortIcon = (column) => {
    if (sortColumn !== column) return <FaSort />;
    return sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold p-6 bg-slate-400 text-white">
        User List
      </h1>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">User List</h2>
          <div className="relative w-80">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-4 text-left text-gray-600">Full Name</th>
                  <th className="p-4 text-left text-gray-600">Email</th>
                  <th
                    className="p-4 text-left text-gray-600 cursor-pointer flex items-center"
                    onClick={() => sortUsers("role")}
                  >
                    Role {getSortIcon("role")}
                  </th>
                  <th className="p-4 text-center text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-t hover:bg-gray-50">
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
      <EditUserModal
        open={open}
        user={selectedUser}
        onClose={handleClose}
        onSubmit={() => {}}
      />
    </div>
  );
};

export default UserList;
