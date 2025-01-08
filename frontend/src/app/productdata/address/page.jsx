"use client";

import { useState, useEffect } from "react";
import { Stepper, Step, StepLabel } from "@mui/material";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";
import AddressPage from "./addressDetails";
import ProductSummaryPage from "./ProductSummaryPage";
import PaymentPage from "./PaymentPage";
import withAuth from "@/app/components/Auth/withAuth";
import { MdOutlineArrowBackIosNew } from "react-icons/md";

// Styled Connector for Custom Colors
const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.primary.main,
    borderTopWidth: 3,
  },
}));

// Styled Step for Active and Completed States
const CustomStepLabel = styled(StepLabel)(({ theme }) => ({
  "& .MuiStepIcon-root": {
    color: theme.palette.primary.light, // Default color
  },
  "& .MuiStepIcon-root.Mui-active": {
    color: theme.palette.primary.main, // Active step color
  },
  "& .MuiStepIcon-root.Mui-completed": {
    color: theme.palette.success.main, // Completed step color
  },
}));

const TabBarLayout = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const [isProductSummarySelected, setisProductSummarySelected] =
    useState(false);

  const steps = ["Address", "Product Summary", "Payment"];

  const handleAddressSelection = (selected) => {
    setIsAddressSelected(selected);
  };

  const handleSummarySelection = (selected) => {
    setisProductSummarySelected(selected);
  };

  const handleProceedToProductSummary = () => {
    if (isAddressSelected) {
      setCurrentStep(1);
    } else {
      alert("Please select an address first.");
    }
  };

  const handleProceedToPayment = () => {
    if (isProductSummarySelected) {
      setCurrentStep(2);
    } else {
      alert("Please complete the product summary first.");
    }
  };

  useEffect(() => {
    localStorage.removeItem("currentActivePage");
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-900 min-h-[100vh] flex justify-center px-4 py-10">
      <div className="container mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 md:p-8">
        {/* Material-UI Stepper */}
        <Stepper
          activeStep={currentStep}
          alternativeLabel
          connector={<CustomConnector />}
          className="dark:text-gray-200"
        >
          {steps.map((label, index) => (
            <Step key={index}>
              <CustomStepLabel>
                <h4
                  className={`dark:text-white ${currentStep < index ? "opacity-25" : null}`}
                >
                  {" "}
                  {label}{" "}
                </h4>{" "}
              </CustomStepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Content Sections */}
        <div className="mt-8">
          {currentStep === 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                Shipping Address
              </h2>

              <AddressPage
                handleAddressSelection={handleAddressSelection}
                handleChnageTab={handleProceedToProductSummary}
              />
            </div>
          )}
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                Product Summary
              </h2>
              <button
                className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                onClick={() => setCurrentStep(0)}
              >
                <MdOutlineArrowBackIosNew className="mr-1" /> Back
              </button>
              <ProductSummaryPage
                handleProceedToPayment={handleProceedToPayment}
                isAddressSelected={isAddressSelected}
                handleSummarySelection={handleSummarySelection}
              />
            </div>
          )}
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                Payment
              </h2>
              <button
                className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                onClick={() => setCurrentStep(1)}
              >
                <MdOutlineArrowBackIosNew className="mr-1" /> Back
              </button>
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

export default withAuth(TabBarLayout, true, ["USER"]);
