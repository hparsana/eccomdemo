"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  getAllAddresses,
  addAddress,
  deleteAddress,
  updateAddress,
} from "@/app/store/Address/addressApi";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import withAuth from "@/app/components/Auth/withAuth";
import { toast } from "react-toastify";

const AddressPage = ({ handleChnageTab, handleAddressSelection }) => {
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showForm, setShowForm] = useState(false); // Toggle for form display
  const [showPaymentButton, setShowPaymentButton] = useState(false); // Toggle payment button
  const [selectedSavedAddress, setSelectedSavedAddress] = useState(null); // Store selected address
  const [showAll, setShowAll] = useState(false);
  const dispatch = useDispatch();

  // Fetch saved addresses and address state from Redux
  const { addressList, loading, error } = useSelector(
    (state) => state.addressData
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Fetch addresses on mount
  useEffect(() => {
    dispatch(getAllAddresses()).then((response) => {
      // Automatically show the form if no addresses are found
      if (response.payload.length === 0) {
        setShowForm(true);
      }
    });
  }, [dispatch]);

  const handleDelete = async (addressId) => {
    await dispatch(deleteAddress(addressId));
    dispatch(getAllAddresses());
  };

  const handleUpdate = (address) => {
    reset(address); // Pre-fill the form with the address data
    setSelectedAddressId(address._id);
    setShowForm(true); // Show the form for editing
    setShowPaymentButton(false); // Hide the payment button while editing
  };

  const handleAddNewAddress = () => {
    reset({
      // Reset all form fields to empty values
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      isDefault: false,
    });
    setShowForm(true); // Show the form for adding
    setSelectedAddressId(null); // Ensure no address is pre-filled
    setShowPaymentButton(false); // Hide the payment button while adding
  };

  const handleSelectSavedAddress = (address) => {
    setSelectedSavedAddress(address); // Store the selected address
    // setShowPaymentButton(true); // Show the payment button
    handleAddressSelection(!!address);
    setShowPaymentButton(true);
  };
  useEffect(() => {
    // Reset selection state when component loads
    if (addressList.length === 0 || !selectedSavedAddress) {
      handleAddressSelection(false);
    }
  }, [addressList, handleAddressSelection]);

  const onSubmit = async (data) => {
    if (selectedAddressId) {
      // Update address
      dispatch(
        updateAddress({ addressId: selectedAddressId, updatedData: data })
      );
      dispatch(getAllAddresses());
    } else {
      // Add new address
      dispatch(addAddress(data));
      dispatch(getAllAddresses());
    }
    reset(); // Clear the form
    setShowForm(false); // Hide the form after submission
    setSelectedAddressId(null);
  };
  // Determine the addresses to display
  const visibleAddresses = showAll ? addressList : addressList.slice(0, 2);
  return (
    <div className=" p-6  flex items-center justify-center md:px-4 px-2">
      <div className="bg-white md:p-8 p-2 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 md:px-0 px-3">
          Shipping Address
        </h2>

        {/* Display Error */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Saved Addresses */}
        {addressList.length > 0 && (
          <div className="mb-6">
            {loading ? (
              <p>Loading addresses...</p>
            ) : (
              <div className=" ">
                {visibleAddresses.map((addr, key) => (
                  <div
                    key={key}
                    className="mb-4 border-b p-2 bg-gray-100 rounded-lg  shadow-md text-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="selectedAddress"
                          value={addr._id}
                          checked={addr._id === selectedSavedAddress?._id}
                          onChange={() => handleSelectSavedAddress(addr)}
                          className="mr-2 accent-blue-500 h-5 w-6"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-orange-500">
                            {addr.fullName || "Saved Address"}
                          </h3>
                          <p>{addr.phone}</p>
                          <p>{addr.addressLine1}</p>
                          <p>
                            {addr.city}, {addr.state}, {addr.postalCode}
                          </p>
                          <p>{addr.country}</p>
                          {addr.isDefault && (
                            <p className="text-sm italic text-green-500">
                              Default
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <FaEdit
                          className="text-blue-500 cursor-pointer"
                          onClick={() => handleUpdate(addr)}
                        />
                        <FaTrashAlt
                          className="text-red-500 cursor-pointer"
                          onClick={() => handleDelete(addr._id)}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* "See More" Button */}
                {addressList.length > 2 && (
                  <button
                    className="mt-0 text-blue-500 hover:underline ml-4"
                    onClick={() => setShowAll((prev) => !prev)}
                  >
                    {showAll ? "See Less..." : "See More..."}
                  </button>
                )}
              </div>
            )}

            {/* Add New Address Button */}

            <button
              className="mt-4 bg-blue-500 text-white py-2 px-4  rounded-lg hover:bg-blue-600 font-bold"
              onClick={handleAddNewAddress}
            >
              Add New Address
            </button>
          </div>
        )}

        {/* Address Form */}
        {showForm && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              {...register("fullName", { required: "Full Name is required" })}
              className={`w-full border p-2 rounded-lg ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName.message}</p>
            )}

            <input
              type="tel"
              placeholder="Phone Number"
              {...register("phone", {
                required: "Phone Number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Enter a valid 10-digit phone number",
                },
              })}
              className={`w-full border p-2 rounded-lg ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}

            <textarea
              placeholder="Street Address"
              {...register("addressLine1", { required: "Address is required" })}
              className={`w-full border p-2 rounded-lg ${
                errors.addressLine1 ? "border-red-500" : "border-gray-300"
              }`}
            ></textarea>
            {errors.addressLine1 && (
              <p className="text-red-500 text-sm">
                {errors.addressLine1.message}
              </p>
            )}

            <input
              type="text"
              {...register("addressLine2")}
              placeholder="Landmark (Optional)"
              className="w-full border p-2 rounded-lg border-gray-300"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="City"
                {...register("city", { required: "City is required" })}
                className={`w-full border p-2 rounded-lg ${
                  errors.city ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.city && (
                <p className="text-red-500 text-sm">{errors.city.message}</p>
              )}

              <input
                type="text"
                placeholder="State"
                {...register("state", { required: "State is required" })}
                className={`w-full border p-2 rounded-lg ${
                  errors.state ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.state && (
                <p className="text-red-500 text-sm">{errors.state.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Postal Code"
                {...register("postalCode", {
                  required: "Postal Code is required",
                  pattern: {
                    value: /^[0-9]{5}$/,
                    message: "Enter a valid 5-digit postal code",
                  },
                })}
                className={`w-full border p-2 rounded-lg ${
                  errors.postalCode ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.postalCode && (
                <p className="text-red-500 text-sm">
                  {errors.postalCode.message}
                </p>
              )}

              <input
                type="text"
                placeholder="Country"
                {...register("country", { required: "Country is required" })}
                className={`w-full border p-2 rounded-lg ${
                  errors.country ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.country && (
                <p className="text-red-500 text-sm">{errors.country.message}</p>
              )}
            </div>

            <label className="flex items-center mt-4">
              <input
                type="checkbox"
                {...register("isDefault")}
                className="mr-2 accent-orange-500 w-5 h-5"
              />
              Set as Default Address
            </label>

            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 font-bold"
            >
              {selectedAddressId ? "Update Address" : "Add Address"}
            </button>
          </form>
        )}

        {/* Payment Button */}
        {showPaymentButton && (
          <button
            className="mt-6 w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 font-bold"
            onClick={() => {
              if (selectedSavedAddress) {
                handleChnageTab(); // Notify the parent to move to Product Summary
              } else {
                toast.error("Please select an address.");
              }
            }}
          >
            Product Summary
          </button>
        )}
      </div>
    </div>
  );
};

export default AddressPage;
