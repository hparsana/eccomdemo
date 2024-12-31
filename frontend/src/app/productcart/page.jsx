"use client";
import React from "react";
import CartProduct from "./CartProduct";
import PriceDetails from "./PriceDetails";
import { useDispatch, useSelector } from "react-redux";
import {
  updateItemQuantity,
  removeItemFromCart,
} from "../store/Cart/cart.slice";

const Cart = () => {
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

  return (
    <div className="min-h-[100vh] bg-gray-50 p-4">
      {cartItems.length !== 0 ? (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4">Cart Items</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <CartProduct
                  key={item.id} // Use the unique ID
                  product={item}
                  updateQuantity={(id, quantity) => {
                    console.log("qunatity", quantity);

                    dispatch(updateItemQuantity({ id: item.id, quantity }));
                  }}
                  removeItem={() => dispatch(removeItemFromCart(item.id))}
                />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg h-fit shadow-md p-4 sticky top-3 md:mt-10 mt-4 md:mb-0 mb-20">
            <PriceDetails
              totalData={calculateTotal()}
              itemsCount={cartItems.length}
            />
            <div className="mt-6 flex justify-end">
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg">
                PLACE ORDER
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-80 justify-center items-center">
          <h1 className="text-[30px]">Cart is Empty..</h1>
        </div>
      )}
    </div>
  );
};

export default Cart;