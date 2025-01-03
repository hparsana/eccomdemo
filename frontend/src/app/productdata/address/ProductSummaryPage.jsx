"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaShieldAlt } from "react-icons/fa";
import CartProduct from "@/app/productcart/CartProduct";
import PriceDetails from "@/app/productcart/PriceDetails";
import {
  removeItemFromCart,
  updateItemQuantity,
} from "@/app/store/Cart/cart.slice";

const ProductSummaryPage = ({
  handleProceedToPayment,
  isAddressSelected,
  handleSummarySelection,
}) => {
  const { cartItems } = useSelector((state) => state.cartData);
  const dispatch = useDispatch();

  const calculateTotal = () => {
    const totalPrice = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const totalOriginalPrice = cartItems.reduce(
      (total, item) => total + item.originalPrice * item.quantity,
      0
    );
    const discount = totalOriginalPrice - totalPrice;

    return {
      totalPrice,
      discount,
      deliveryCharge: totalPrice > 5000 ? 0 : 99,
      totalAmount: totalPrice + (totalPrice > 5000 ? 0 : 99),
    };
  };
  useEffect(() => {
    // Reset selection state when component loads
    if (isAddressSelected) {
      handleSummarySelection(true);
    }
  }, [isAddressSelected, handleSummarySelection]);
  return (
    <div
      className={`min-h-auto  p-4 ${
        isAddressSelected ? "opacity-100" : "opacity-50 pointer-events-none"
      }`}
    >
      {cartItems.length !== 0 ? (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <CartProduct
                  key={item.id}
                  product={item}
                  updateQuantity={(id, quantity) => {
                    dispatch(updateItemQuantity({ id: item.id, quantity }));
                  }}
                  removeItem={() => dispatch(removeItemFromCart(item.id))}
                />
              ))}
            </div>
          </div>
          <div>
            <div className="bg-white rounded-lg h-fit shadow-md p-4 sticky    md:mb-0 mb-20">
              <PriceDetails
                totalData={calculateTotal()}
                itemsCount={cartItems.length}
              />
              <div className="mt-6 flex justify-end">
                <button
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg"
                  onClick={handleProceedToPayment}
                  disabled={!isAddressSelected}
                >
                  PROCEED TO PAYMENT
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-3 mt-6">
              <FaShieldAlt className="text-[#878787] text-[25px]" />
              <h1 className="md:text-[16px] text-[14px] text-left text-[#878787] md:pr-10 font-medium">
                Safe and Secure Payments. Easy returns. 100% Authentic products.
              </h1>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-80 justify-center items-center">
          <h1 className="text-[30px]">
            No Products in the Summary.. Plz go Back
          </h1>
        </div>
      )}
    </div>
  );
};

export default ProductSummaryPage;
