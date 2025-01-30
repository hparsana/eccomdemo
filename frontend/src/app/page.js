"use client";
import withAuth from "./components/Auth/withAuth";
import Image from "next/image";
import Link from "next/link";
import DealsOfTheDay from "@/app/components/home/DealsOfTheDay";
const Home = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Banner */}
      <div className="relative h-96 bg-cover bg-center">
        <Image
          src="https://picsum.photos/1600/900"
          alt="Hero Banner"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Shop Smarter, Live Better
            </h1>
            <p className="text-lg md:text-xl mb-6">
              Discover the best deals on top brands
            </p>
            <Link
              href="/products"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Explore Now
            </Link>
          </div>
        </div>
      </div>

      {/* Category Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-8">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <Image
                src={`https://picsum.photos/300/200?random=${index}`}
                alt={`Category ${index + 1}`}
                width={300}
                height={200}
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Category {index + 1}
                </h3>
                <Link
                  href="/category"
                  className="text-gray-600 dark:text-gray-400 hover:underline"
                >
                  Explore now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deals of the Day */}
      <DealsOfTheDay />

      {/* Trending Products */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-8">
          Trending Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <Image
                src={`https://picsum.photos/300/200?random=${index + 8}`}
                alt={`Product ${index + 1}`}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Product {index + 1}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Lorem ipsum dolor sit amet
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold text-gray-800 dark:text-white">
                    $29.99
                  </span>
                  <Link
                    href="/product"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                  >
                    Add to Cart
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default withAuth(Home, true, ["USER"]);
