"use client";
import { useState, useRef } from "react";
import Image from "next/image";

const ProductImageWithZoom = ({ product }) => {
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const imageContainerRef = useRef(null);

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setHoverPosition({ x, y });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div className="relative flex">
      {/* Main Image */}
      <div
        ref={imageContainerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-[500px] overflow-hidden cursor-crosshair"
      >
        <Image
          src={product.images[0]?.url}
          alt="Product Image"
          width={700}
          height={700}
          className="rounded-lg w-full h-full object-cover"
        />
      </div>

      {/* Hover Zoom Popup */}
      {isHovered && (
        <div
          className="absolute top-0 right-[-400px] w-[400px] h-[500px] border border-gray-300 shadow-lg rounded-lg overflow-hidden bg-white"
          style={{ pointerEvents: "none" }} // Prevent interfering with mouse events
        >
          <Image
            src={product.images[0]?.url}
            alt="Zoomed Image"
            width={1200}
            height={1200}
            className="absolute w-[200%] h-[200%]"
            style={{
              top: `-${hoverPosition.y}%`,
              left: `-${hoverPosition.x}%`,
              transition: "top 0.1s, left 0.1s",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ProductImageWithZoom;
