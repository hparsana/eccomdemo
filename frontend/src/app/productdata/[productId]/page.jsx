"use client";
import { useParams } from "next/navigation";
import productData from "../../components/product";
import Image from "next/image";
import { FaStar, FaTruck, FaHeart, FaChevronRight } from "react-icons/fa";
import { useState } from "react";

const ProductDetail = () => {
  const { productId } = useParams();
  const { products } = productData.data;

  const product = products.find((item) => item._id === productId);
  const [mainImage, setMainImage] = useState(product?.images[0].url);

  const similarProducts = products.slice(0, 4); // Mock Similar Products

  if (!product) {
    return <div className="text-center text-gray-700">Product not found!</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen md:mb-0mb-16">
      {/* Product Container */}
      <div className="max-w-[1200px] mx-auto py-8 px-4 lg:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white p-6 rounded-lg shadow-md">
          {/* Product Images */}
          <div>
            <Image
              src={mainImage}
              alt="Product Image"
              width={700}
              height={700}
              className="rounded-lg w-full h-[500px] object-cover"
            />
            <div className="flex gap-4 mt-4">
              {product.images.map((img) => (
                <Image
                  key={img._id}
                  src={img.url}
                  alt={img.alt}
                  width={80}
                  height={80}
                  className={`cursor-pointer border-2 rounded-lg ${
                    mainImage === img.url
                      ? "border-blue-500"
                      : "border-gray-300"
                  }`}
                  onClick={() => setMainImage(img.url)}
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              {product.description}
            </p>

            {/* Price Section */}
            <div className="flex items-center gap-4 text-2xl">
              <span className="text-blue-600 font-bold">₹{product.price}</span>
              <span className="text-gray-400 line-through">
                ₹{product.originalPrice}
              </span>
              <span className="text-green-600 font-semibold text-lg">
                {product.discount}
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-500">
                {Array.from({ length: Math.round(product.rating) }).map(
                  (_, i) => (
                    <FaStar key={i} />
                  )
                )}
              </div>
              <span className="text-gray-600">
                {product.rating} ({product.reviews.length} reviews)
              </span>
            </div>

            {/* Features */}
            {product.features && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Key Features:
                </h3>
                <ul className="list-disc list-inside text-gray-600">
                  {product.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sizes */}
            {product.size && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Sizes:</h3>
                <div className="flex gap-2">
                  {product.size.map((size) => (
                    <span
                      key={size}
                      className="border px-3 py-1 rounded-md text-gray-700"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-6 mt-4">
              <button className="bg-yellow-500 text-white text-lg py-3 px-6 rounded-lg hover:bg-yellow-600 transition">
                Add to Cart
              </button>
              <button className="bg-orange-500 text-white text-lg py-3 px-6 rounded-lg hover:bg-orange-600 transition">
                Buy Now
              </button>
            </div>

            {/* Delivery Info */}
            <div className="flex items-center gap-4 mt-4 text-green-600 font-semibold">
              <FaTruck className="w-5 h-5" />
              Free Delivery Available
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4">Product Details</h2>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
            hendrerit lacus at massa facilisis, vitae dictum ipsum fermentum.
          </p>
        </div>

        {/* Ratings and Reviews */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4">Ratings & Reviews</h2>
          {product.reviews.map((review, idx) => (
            <div
              key={idx}
              className="border-b py-4 last:border-b-0 flex flex-col gap-2"
            >
              <span className="font-semibold">{review.reviewer}</span>
              <div className="flex text-yellow-500">
                {Array.from({ length: Math.round(review.rating) }).map(
                  (_, i) => (
                    <FaStar key={i} />
                  )
                )}
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>

        {/* Similar Products */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Similar Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map((item) => (
              <div
                key={item._id}
                className="border p-4 rounded-lg shadow-md bg-white"
              >
                <Image
                  src={item.images[0]?.url}
                  alt={item.name}
                  width={300}
                  height={300}
                  className="rounded-lg w-full h-[200px] object-cover"
                />
                <h3 className="text-lg font-semibold mt-2">{item.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-blue-500 font-bold">₹{item.price}</span>
                  <span className="line-through text-gray-400">
                    ₹{item.originalPrice}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
