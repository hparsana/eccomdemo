"use client";

import React from "react";

function SubcategoryLink({ category, subcategory }) {
  const handleClick = () => {
    const currentUrl = window.location.href; // Get the current URL
    const url = new URL(currentUrl);

    // Add or update query parameters
    url.searchParams.set("category", category);
    url.searchParams.set("subcategory", subcategory);

    // Push the updated URL to the browser history
    window.history.pushState({}, "", url);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer text-gray-600  hover:text-blue-600 dark:hover:text-blue-600 transition-colors duration-200"
    >
      <h3 className="font-semibold text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-300">
        {subcategory}
      </h3>
    </div>
  );
}

export default SubcategoryLink;
