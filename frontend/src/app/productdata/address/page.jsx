"use client";

import { useEffect, useState } from "react";
import PaymentPage from "./PaymentPage";
import AddressPage from "./addressDetails";
import withAuth from "@/app/components/Auth/withAuth";
import ProductSummaryPage from "./ProductSummaryPage";

const TabBarLayout = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const [isProductSummarySelected, setisProductSummarySelected] =
    useState(false);

  const handleAddressSelection = (selected) => {
    setIsAddressSelected(selected);
  };
  const handleSummarySelection = (selected) => {
    setisProductSummarySelected(selected);
  };
  const handleProceedToProductSummary = () => {
    if (isAddressSelected) {
      setCurrentStep(2); // Move to Product Summary
    } else {
      alert("Please select an address first.");
    }
  };

  const handleProceedToPayment = () => {
    setisProductSummarySelected(true);
    setCurrentStep(3); // Move to Payment Page
  };

  useEffect(() => {
    localStorage.removeItem("currentActivePage");
  }, []);

  return (
    <div className=" bg-gradient-to-br from-gray-50 min-h-[90vh] to-gray-200 flex  justify-center px-4 py-10">
      {/* Container */}
      <div className="container mx-auto bg-white shadow-lg rounded-lg p-4 md:p-8 transition-all duration-500">
        {/* Step Navigation */}
        <div className="flex justify-center mb-6 space-x-4">
          <div
            className={`flex-1 text-center py-2 px-4 rounded-lg cursor-pointer ${
              currentStep === 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
            onClick={() => setCurrentStep(1)}
          >
            Address
          </div>
          <div
            className={`flex-1 text-center py-2 px-4 rounded-lg cursor-pointer ${
              currentStep === 2
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
            onClick={() => isAddressSelected && setCurrentStep(2)}
          >
            Product Summary
          </div>
          <div
            className={`flex-1 text-center py-2 px-4 rounded-lg cursor-pointer ${
              currentStep === 3
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
            onClick={() =>
              currentStep === 2 && isProductSummarySelected && setCurrentStep(3)
            }
          >
            Payment
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 3 gap-6">
          {/* Address Section */}
          {currentStep === 1 && (
            <div className="col-span-1 md:col-span-1">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Shipping Address
              </h2>
              <AddressPage
                handleAddressSelection={handleAddressSelection}
                handleChnageTab={handleProceedToProductSummary}
              />
            </div>
          )}

          {/* Product Summary Section */}
          {currentStep === 2 && (
            <div
              className={`col-span-1 md:col-span-1 ${
                isAddressSelected ? "opacity-100" : "opacity-50"
              }`}
            >
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Product Summary
              </h2>
              <ProductSummaryPage
                handleProceedToPayment={handleProceedToPayment}
                isAddressSelected={isAddressSelected}
                handleSummarySelection={handleSummarySelection}
              />
            </div>
          )}

          {/* Payment Section */}
          {currentStep === 3 && (
            <div
              className={`col-span-1 md:col-span-1 ${
                isProductSummarySelected ? "opacity-100" : "opacity-50"
              }`}
            >
              <h2 className="text-xl font-bold mb-4 text-gray-800">Payment</h2>
              <PaymentPage
                isProductSummarySelected={isProductSummarySelected}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default withAuth(TabBarLayout, true, ["USER", "ADMIN"]);
