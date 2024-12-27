"use client";
import React, { useState } from "react";
import Link from "next/link"; // Import Next.js Link for navigation
import { cn } from "@/lib/utils";

export function NavbarDemo() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar />
    </div>
  );
}

function Navbar() {
  const [active, setActive] = useState(null);

  const megaMenuData = {
    Electronics: {
      Mobiles: ["Mi", "Realme", "Samsung", "Infinix", "OPPO", "Apple"],
      "Mobile Accessories": ["Mobile Cases", "Headphones", "Power Banks"],
    },
    "TVs & Appliances": {
      Televisions: ["Smart TVs", "LED TVs", "QLED TVs"],
      Refrigerators: ["Single Door", "Double Door"],
    },
    "Home & Furniture": {
      Furniture: ["Sofas", "Beds", "Dining Tables"],
      Decor: ["Curtains", "Cushions", "Wall Art"],
    },
  };

  const handleMouseEnter = (category) => {
    setActive(category);
  };

  const handleMouseLeave = () => {
    setActive(null);
  };

  return (
    <div className="w-full bg-white shadow-md z-50">
      <nav className="container mx-auto flex items-center justify-center gap-x-16 px-6 py-4">
        {Object.keys(megaMenuData).map((category) => (
          <div
            key={category}
            className="group relative cursor-pointer"
            onMouseEnter={() => handleMouseEnter(category)}
            onMouseLeave={handleMouseLeave}
          >
            {/* Title */}
            <span className="font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200">
              {category}
            </span>

            {/* Dropdown (Menu) */}
            <div
              className={cn(
                "absolute left-0 top-full bg-white shadow-xl border border-gray-200 mt-2 rounded-lg transform transition-all duration-500 ease-in-out",
                active === category
                  ? "opacity-100 scale-100 translate-y-0 visible"
                  : "opacity-0 scale-95 translate-y-2 invisible"
              )}
              style={{ minWidth: "300px", maxWidth: "600px" }}
            >
              <div className="grid grid-cols-2 gap-6 p-4">
                {Object.entries(megaMenuData[category]).map(
                  ([subcategory, items]) => (
                    <div key={subcategory} className="flex flex-col">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {subcategory}
                      </h3>
                      <ul className="space-y-1">
                        {items.map((item, index) => (
                          <li key={index}>
                            <Link
                              href={`/productdata`}
                              className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                            >
                              {item}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}
