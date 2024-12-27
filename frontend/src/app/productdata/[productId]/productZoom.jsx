"use client";
import {
  fetchSavedProducts,
  saveProduct,
  unsaveProduct,
} from "@/app/store/SaveProduct/savedProductApi";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

const ImageZoom = ({ mainImage, product }) => {
  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});
  const [highlightStyle, setHighlightStyle] = useState({});
  const [like, setLike] = useState(false); // Local like state
  const dispatch = useDispatch();
  const { userLoggedIn } = useSelector((state) => state.userAuthData);

  const savedProducts = useSelector(
    (state) => state.savedProductData.savedProducts
  );
  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const highlightSize = 190; // Size of the square highlight box
    let x = e.clientX - rect.left - highlightSize / 2; // Center horizontally
    let y = e.clientY - rect.top - highlightSize / 2; // Center vertically

    // Ensure the square stays within the bounds of the image
    x = Math.max(0, Math.min(x, rect.width - highlightSize));
    y = Math.max(0, Math.min(y, rect.height - highlightSize));

    // Calculate zoomed image position
    const zoomX = ((x + highlightSize / 2) / rect.width) * 100; // Adjusted for square center
    const zoomY = ((y + highlightSize / 2) / rect.height) * 100; // Adjusted for square center

    // Update styles for the zoomed area
    setZoomStyle({
      backgroundImage: `url(${mainImage})`,
      backgroundPosition: `${zoomX}% ${zoomY}%`,
      backgroundSize: "250%",
    });

    // Update styles for the square highlight area
    setHighlightStyle({
      top: y,
      left: x,
      width: highlightSize,
      height: highlightSize,
    });
  };
  useEffect(() => {
    dispatch(fetchSavedProducts());
  }, [dispatch, userLoggedIn]);

  useEffect(() => {
    const isLiked = savedProducts.some((item) => item._id === product._id);
    setLike(isLiked);
  }, [savedProducts, product._id]);

  const handleLike = () => {
    if (like) {
      dispatch(unsaveProduct(product._id)); // Remove from Redux
    } else {
      dispatch(saveProduct(product)); // Add to Redux
    }
    setLike(!like); // Toggle local state
  };
  return (
    <div className="relative">
      <div
        className="relative cursor-crosshair lg:block hidden"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setZoomVisible(true)}
        onMouseLeave={() => {
          setZoomVisible(false);
          setHighlightStyle({});
        }}
      >
        <Image
          src={mainImage}
          alt="Product Image"
          width={700}
          height={700}
          className="rounded-lg w-full h-[500px] object-cover"
        />
        <div
          className="absolute top-5 right-3 bg-white w-12 h-12 rounded-full flex justify-center items-center shadow-lg"
          onMouseEnter={() => setZoomVisible(false)}
          onMouseLeave={() => setZoomVisible(true)}
        >
          <FaHeart
            className={`w-7 h-7 ${like ? "text-red-500" : "text-gray-300"} cursor-pointer`}
            onClick={handleLike}
          />
        </div>
        {/* Square Highlighted Area */}
        {zoomVisible && (
          <div
            className="absolute bg-green-200 opacity-50 pointer-events-none"
            style={{
              position: "absolute",
              ...highlightStyle,
            }}
          ></div>
        )}
      </div>

      {/* Zoom Popup */}
      {zoomVisible && (
        <div
          className="absolute border ml-2 w-full h-[750px] top-0 left-[105%] border-gray-300 rounded-lg bg-white overflow-hidden lg:block hidden"
          style={zoomStyle}
        ></div>
      )}
    </div>
  );
};

export default ImageZoom;
