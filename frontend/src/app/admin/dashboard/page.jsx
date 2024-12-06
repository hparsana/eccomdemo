"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaBoxOpen,
  FaShoppingCart,
  FaDollarSign,
  FaChartPie,
  FaBell,
} from "react-icons/fa";
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashBoard = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      icon: <FaUsers />,
      bgColor: "bg-blue-500",
    },
    {
      title: "Products",
      value: "543",
      icon: <FaBoxOpen />,
      bgColor: "bg-green-500",
    },
    {
      title: "Orders",
      value: "1,027",
      icon: <FaShoppingCart />,
      bgColor: "bg-yellow-500",
    },
    {
      title: "Revenue",
      value: "$12,345",
      icon: <FaDollarSign />,
      bgColor: "bg-purple-500",
    },
  ];

  const notifications = [
    { id: 1, message: "New user registered", timestamp: "5 mins ago" },
    { id: 2, message: "Order #1234 placed", timestamp: "10 mins ago" },
    { id: 3, message: "Product stock low", timestamp: "1 hour ago" },
    { id: 4, message: "Revenue goal achieved", timestamp: "2 hours ago" },
  ];

  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Sales",
        data: [30, 50, 70, 90, 120, 150, 200],
        borderColor: "#4A90E2",
        backgroundColor: "rgba(74, 144, 226, 0.5)",
        tension: 0.3,
      },
    ],
  };

  const barChartData = {
    labels: ["Electronics", "Clothes", "Home", "Books", "Toys"],
    datasets: [
      {
        label: "Products Sold",
        data: [500, 700, 300, 200, 400],
        backgroundColor: [
          "#4A90E2",
          "#50E3C2",
          "#F5A623",
          "#BD10E0",
          "#F8E71C",
        ],
      },
    ],
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 relative">
        <motion.h1
          className="text-2xl font-bold text-gray-700"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Admin Dashboard
        </motion.h1>
        <div className="relative">
          <motion.button
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-all"
            initial={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            onClick={() => setIsDropdownOpen((prev) => !prev)}
          >
            <FaBell className="mr-2" />
            Notifications
          </motion.button>

          {/* Notification Dropdown */}
          {isDropdownOpen && (
            <motion.div
              className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg overflow-hidden z-50"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-2 border-b bg-gray-50">
                <h4 className="text-sm font-semibold text-gray-700">
                  Notifications
                </h4>
              </div>
              {notifications.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {notifications.map((notification) => (
                    <li
                      key={notification.id}
                      className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      <p>{notification.message}</p>
                      <span className="text-xs text-gray-500">
                        {notification.timestamp}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-sm text-gray-500 text-center">
                  No new notifications
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className={`p-4 rounded-lg shadow-lg text-white flex items-center ${stat.bgColor} transition-transform hover:scale-105`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <div className="text-4xl mr-4">{stat.icon}</div>
            <div>
              <h3 className="text-lg font-semibold">{stat.title}</h3>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Line Chart */}
        <motion.div
          className="bg-white p-6 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-semibold mb-4">Sales Over Time</h3>
          <Line data={lineChartData} />
        </motion.div>

        {/* Bar Chart */}
        <motion.div
          className="bg-white p-6 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-semibold mb-4">Products Sold</h3>
          <Bar data={barChartData} />
        </motion.div>
      </div>
    </div>
  );
};

export default DashBoard;
