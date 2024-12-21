"use client";
import Image from "next/image";
import { useState } from "react";

const ImageZoom = ({ mainImage }) => {
  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});
  const [highlightStyle, setHighlightStyle] = useState({});

  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left; // X-coordinate relative to the image
    const y = e.clientY - rect.top; // Y-coordinate relative to the image

    // Calculate zoomed image position
    const zoomX = (x / rect.width) * 100; // Percentage position in X
    const zoomY = (y / rect.height) * 100; // Percentage position in Y

    // Update styles for the zoomed area
    setZoomStyle({
      backgroundImage: `url(${mainImage})`,
      backgroundPosition: `${zoomX}% ${zoomY}%`,
      backgroundSize: "250%",
    });

    // Update styles for the highlighted area
    setHighlightStyle({
      top: y - 70,
      left: x - 70,
      width: 150,
      height: 150,
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
        {/* Highlighted Area */}
        {zoomVisible && (
          <div
            className="absolute bg-green-200 opacity-50 pointer-events-none"
            style={{
              position: "absolute",
              borderRadius: "50%",
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
