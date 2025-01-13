"use client";
import React, { useState } from "react";
import { FaChevronDown, FaChevronUp, FaClipboardList } from "react-icons/fa";

export default function GeneralInfo({ product }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const generalInfoItems = [
    { label: "In The Box", value: product.InTheBox },
    { label: "Model Number", value: product.ModelNumber },
    { label: "Model Name", value: product.ModelName },
    { label: "SIM Type", value: product.SIMType },
    { label: "Hybrid SIM Slot", value: product.HybridSimSlot },
    { label: "Touchscreen", value: product.Touchscreen },
    { label: "OTG Compatible", value: product.OTGCompatible },
    { label: "Quick Charging", value: product.QuickCharging },
    { label: "Display Size", value: product.DisplaySize },
    { label: "Resolution", value: product.Resolution },
    { label: "Resolution Type", value: product.ResolutionType },
    { label: "GPU", value: product.GPU },
    { label: "Other Display Features", value: product.OtherDisplayFeatures },
    { label: "Display Type", value: product.DisplayType },
    { label: "HD Game Support", value: product.HDGameSupport },
    { label: "Operating System", value: product.OperatingSystem },
    { label: "Processor Brand", value: product.ProcessorBrand },
    { label: "Processor Type", value: product.ProcessorType },
    { label: "Processor Core", value: product.ProcessorCore },
    { label: "Primary Clock Speed", value: product.PrimaryClockSpeed },
    { label: "Secondary Clock Speed", value: product.SecondaryClockSpeed },
    { label: "Operating Frequency", value: product.OperatingFrequency },
    { label: "Internal Storage", value: product.InternalStorage },
    { label: "RAM", value: product.RAM },
    { label: "Total Memory", value: product.TotalMemory },
    { label: "Primary Camera", value: product.PrimaryCamera },
    { label: "Primary Camera Features", value: product.PrimaryCameraFeatures },
    { label: "Secondary Camera", value: product.SecondaryCamera },
    {
      label: "Video Recording Resolution",
      value: product.VideoRecordingResolution,
    },
    { label: "Digital Zoom", value: product.DigitalZoom },
    { label: "Frame Rate", value: product.FrameRate },
    { label: "Dual Camera Lens", value: product.DualCameraLens },
    { label: "Optical Zoom", value: product.OpticalZoom },
    {
      label: "Secondary Camera Available",
      value: product.SecondaryCameraAvailable,
    },
    { label: "Flash", value: product.Flash },
    { label: "HD Recording", value: product.HDRecording },
    { label: "Full HD Recording", value: product.FullHDRecording },
    { label: "Video Recording", value: product.VideoRecording },
  ].filter((item) => item.value); // Filter out items with no value

  const visibleItems = isExpanded
    ? generalInfoItems
    : generalInfoItems.slice(0, 4);

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-md dark:bg-gray-700">
      <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center dark:text-green-400">
        <i className="text-green-500 mr-2">
          <FaClipboardList />
        </i>
        General Info
      </h3>
      <ul
        className={`grid grid-cols-1 gap-4 text-gray-600 dark:text-gray-400 overflow-hidden transition-all duration-700 ease-in-out ${
          isExpanded ? "max-h-[1000px]" : "max-h-0"
        }`}
        style={{
          maxHeight: isExpanded ? `${generalInfoItems.length * 40}px` : "160px",
        }}
      >
        {generalInfoItems.map((item, index) => (
          <li
            key={index}
            className={`flex items-center ${
              index >= visibleItems.length - 1 ? "opacity-60" : "opacity-100"
            } ${index >= visibleItems.length - 2 ? "opacity-80" : "opacity-100"}`}
          >
            <strong className="text-gray-800 mr-2 dark:text-gray-300">
              {item.label}:
            </strong>
            <span>{item.value}</span>
          </li>
        ))}
      </ul>

      {generalInfoItems.length > 4 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 flex items-center text-blue-500 dark:text-blue-400 hover:underline"
        >
          {isExpanded ? (
            <>
              Show Less <FaChevronUp className="ml-2" />
            </>
          ) : (
            <>
              Show More <FaChevronDown className="ml-2" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
