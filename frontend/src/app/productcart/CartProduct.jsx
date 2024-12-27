import React from "react";

const CartProduct = ({ product, updateQuantity, removeItem }) => {
  const imageUrl =
    product.image && product.image.length > 0
      ? product.image[0]?.url
      : "/placeholder-image.jpg"; // Fallback to a placeholder image

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-start gap-4">
      <img
        src={imageUrl}
        alt={product.name || "Product Image"}
        className="w-24 h-24 object-cover rounded"
      />
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-sm text-gray-600">Brand: {product?.brand}</p>
        <div className="flex gap-x-5 mt-1">
          <p className="text-sm text-gray-600">Color: {product.color}</p>
          {product.size && (
            <p className="text-sm text-gray-600">Size: {product.size}</p>
          )}
        </div>
        <p className="text-sm text-gray-600">{product.description}</p>
        <div className="flex items-center mt-2">
          <span className="text-lg font-bold text-gray-800">
            ₹{product.price}
          </span>
          <span className="text-sm text-gray-500 line-through ml-2">
            ₹{product.originalPrice}
          </span>
          <span className="text-sm text-green-600 ml-2">
            {product.discount?.percentage}% Off
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          <span className="text-gray-800 font-medium">Discount Details:</span>
          <span className="text-green-600 font-semibold">
            {" "}
            Save ₹{product.discount?.amount}
          </span>
          <span className="text-gray-600 md:ml-2">Valid from</span>
          <span className="text-blue-500">
            {" "}
            {new Date(product.discount?.startDate).toLocaleDateString()}
          </span>
          <span className="text-gray-600"> to</span>
          <span className="text-blue-500">
            {" "}
            {new Date(product.discount?.endDate).toLocaleDateString()}
          </span>
        </p>

        <div className="flex items-center mt-3 space-x-4">
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              onClick={() => updateQuantity(product.id, product.quantity - 1)}
              className="px-3 py-1"
            >
              -
            </button>
            <input
              type="text"
              value={product.quantity}
              readOnly
              className="w-12 text-center border-none focus:outline-none"
            />
            <button
              onClick={() => updateQuantity(product.id, product.quantity + 1)}
              className="px-3 py-1"
            >
              +
            </button>
          </div>
          <button
            onClick={() => removeItem(product.id)}
            className="text-red-600 hover:underline"
          >
            REMOVE
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartProduct;
