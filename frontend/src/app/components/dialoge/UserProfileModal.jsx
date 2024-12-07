import React from "react";
import { Modal } from "@mui/material";
import {
  FaEnvelope,
  FaUserTag,
  FaRegCalendarAlt,
  FaCamera,
} from "react-icons/fa";

const UserProfileModal = ({ isOpen, onClose, user }) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="user-profile-modal"
      className="flex items-center justify-center md:m-0 m-5 border-none"
    >
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg relative overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 h-24 flex items-center justify-center relative">
          <button
            className="absolute top-1  right-3 text-white hover:text-gray-200 text-[30px]"
            onClick={onClose}
          >
            &times;
          </button>
          <div className="w-20 h-20 bg-white text-blue-500 rounded-full flex items-center justify-center shadow-md border-4 border-blue-500 absolute -bottom-10">
            <span className="text-3xl font-bold">
              {user.fullname.charAt(0).toUpperCase()}
            </span>
            <button
              className="absolute bottom-[-5px] right-[-5px] bg-blue-500 text-white p-2 rounded-full border-2 border-white shadow-lg hover:bg-blue-600"
              onClick={() => alert("Upload image functionality coming soon!")}
            >
              <FaCamera className="text-sm" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="pt-12 px-6 pb-6">
          <h2 className="text-2xl font-bold text-center">{user.fullname}</h2>
          <p className="text-center text-gray-600">{user.email}</p>
          <p className="text-center text-sm text-gray-500 mt-1">
            Member since:{" "}
            <span className="font-medium text-gray-700">
              {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </p>

          {/* Info Section */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-100">
              <FaEnvelope className="text-blue-500 text-lg" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-100">
              <FaUserTag className="text-blue-500 text-lg" />
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium text-gray-800">{user.role}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-100">
              <FaRegCalendarAlt className="text-blue-500 text-lg" />
              <div>
                <p className="text-sm text-gray-500">Account Created</p>
                <p className="font-medium text-gray-800">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 px-6 py-4 text-right">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UserProfileModal;
