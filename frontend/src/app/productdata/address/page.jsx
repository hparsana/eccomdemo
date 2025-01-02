"use client";

import { useEffect, useState } from "react";
import PaymentPage from "./PaymentPage";
import AddressPage from "./addressDetails";
import withAuth from "@/app/components/Auth/withAuth";

const TabBarLayout = () => {
  const [isAddressSelected, setIsAddressSelected] = useState(false);

  const handleAddressSelection = (selected) => {
    setIsAddressSelected(selected);
  };
  useEffect(() => {
    localStorage.removeItem("currentActivePage");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center px-4 py-10">
      {/* Container */}
      <div className="container mx-auto flex flex-col md:flex-row gap-6 bg-white shadow-lg rounded-lg p-6 md:p-8">
        {/* Address Section */}
        <div className="flex-1 border-r md:pr-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Shipping Address
          </h2>
          <AddressPage handleAddressSelection={handleAddressSelection} />
        </div>

        {/* Payment Section */}
        <div
          className={`flex-1 md:pl-6 ${
            isAddressSelected ? "opacity-100" : "opacity-50 pointer-events-none"
          }`}
        >
          <h2 className="text-xl font-bold mb-4 text-gray-800">Payment</h2>
          <PaymentPage />
        </div>
      </div>
    </div>
  );
};

export default withAuth(TabBarLayout, true, ["USER", "ADMIN"]);
