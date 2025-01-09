import React, { useState } from "react";
import { Modal } from "@mui/material";
import {
  FaEnvelope,
  FaUserTag,
  FaRegCalendarAlt,
  FaCamera,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "@/app/store/Auth/auth.slice";

const UserProfileModal = ({ isOpen, onClose, user }) => {
  const { darkMode } = useSelector((state) => state.userAuthData);
  const dispatch = useDispatch();
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="user-profile-modal"
      className="flex items-center justify-center md:m-0 m-5 border-none"
    >
      <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-full max-w-md rounded-lg shadow-lg relative overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 dark:from-gray-700 dark:to-gray-900 h-24 flex items-center justify-center relative">
          <button
            className="absolute top-1 right-3 text-white hover:text-gray-200 text-[30px]"
            onClick={onClose}
          >
            &times;
          </button>
          <div className="w-20 h-20 bg-white dark:bg-gray-900 text-blue-500 dark:text-gray-300 rounded-full flex items-center justify-center shadow-md border-4 border-blue-500 dark:border-gray-700 absolute -bottom-10">
            <span className="text-3xl font-bold">
              {user?.fullname?.charAt(0).toUpperCase()}
            </span>
            <button
              className="absolute bottom-[-5px] right-[-5px] bg-blue-500 dark:bg-gray-700 text-white dark:text-gray-300 p-2 rounded-full border-2 border-white dark:border-gray-600 shadow-lg hover:bg-blue-600 dark:hover:bg-gray-600"
              onClick={() => alert("Upload image functionality coming soon!")}
            >
              <FaCamera className="text-sm" />
            </button>
          </div>
        </div>
        {/* Dark Mode Toggle */}
        <div className="absolute top-3 left-3">
          <button
            onClick={() => dispatch(toggleDarkMode())}
            className="flex items-center p-2 bg-gray-200 dark:bg-gray-700 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 dark:hover:bg-gray-600"
          >
            {darkMode ? (
              <FaMoon className="text-xl text-gray-500 dark:text-gray-300" />
            ) : (
              <FaSun className="text-xl text-yellow-500" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="pt-12 px-6 pb-6">
          <h2 className="text-2xl font-bold text-center">{user?.fullname}</h2>
          <p className="text-center text-gray-600 dark:text-gray-400">
            {user?.email}
          </p>
          <p className="text-center text-sm mt-1">
            Member since:{" "}
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {new Date(user?.createdAt).toLocaleDateString()}
            </span>
          </p>

          {/* Info Section */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center space-x-4 p-4 border rounded-lg border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
              <FaEnvelope className="text-blue-500 text-lg" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Email
                </p>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {user?.email}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 border rounded-lg border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
              <FaUserTag className="text-blue-500 text-lg" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {user?.role}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 border rounded-lg border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
              <FaRegCalendarAlt className="text-blue-500 text-lg" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Account Created
                </p>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {new Date(user?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 dark:bg-gray-700 px-6 py-4 text-right">
          <button
            onClick={onClose}
            className="bg-blue-500 dark:bg-gray-600 text-white dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-gray-500 transition"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UserProfileModal;
