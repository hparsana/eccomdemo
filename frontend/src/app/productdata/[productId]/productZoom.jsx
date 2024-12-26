"use client";
import Image from "next/image";
import { useState } from "react";

const ImageZoom = ({ mainImage }) => {
  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});
  const [highlightStyle, setHighlightStyle] = useState({});

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
