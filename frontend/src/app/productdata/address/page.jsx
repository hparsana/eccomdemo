"use client";

import { useEffect, useState } from "react";
import PaymentPage from "./PaymentPage";
import AddressPage from "./addressDetails";
import withAuth from "@/app/components/Auth/withAuth";

const TabBarLayout = () => {
  const [activeTab, setActiveTab] = useState(1); // 1 = Address, 2 = Payment

  useEffect(() => {
    localStorage.removeItem("currentActivePage");
  }, []);

  const handleChnageTab = () => {
    setActiveTab(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col items-center justify-start px-4 pt-10">
      {/* Tab Bar */}
      <div className="w-full max-w-4xl flex justify-center border-b border-gray-200 mb-6">
        <button
          className={`flex-1 text-center py-3 text-lg font-semibold transition-colors duration-300 ${
            activeTab === 1
              ? "text-blue-600 border-b-4 border-blue-600"
              : "text-gray-500 hover:text-blue-500"
          }`}
          onClick={() => setActiveTab(1)}
        >
          Address
        </button>
        <button
          className={`flex-1 text-center py-3 text-lg font-semibold transition-colors duration-300 ${
            activeTab === 2
              ? "text-blue-600 border-b-4 border-blue-600"
              : "text-gray-500 hover:text-blue-500"
          }`}
          onClick={() => setActiveTab(2)}
        >
          Payment
        </button>
      </div>

      {/* Content */}
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 md:p-8">
        {activeTab === 1 && <AddressPage handleChnageTab={handleChnageTab} />}
        {activeTab === 2 && <PaymentPage />}
      </div>
    </div>
  );
};

export default withAuth(TabBarLayout, true, ["USER", "ADMIN"]);
