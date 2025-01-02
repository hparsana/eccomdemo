"use client";

import React from "react";
import { duration, Modal } from "@mui/material";
import {
  FaFacebook,
  FaTwitter,
  FaWhatsapp,
  FaLinkedin,
  FaPinterest,
  FaReddit,
  FaTelegram,
  FaEnvelope,
  FaCopy,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { IoMdClose } from "react-icons/io";

const SocialMediaShareModal = ({ open, onClose, product }) => {
  const productUrl = `${window.location.origin}/productdata/${product?._id}`;
  const shareText = `Check out this product on Tuftzy: ${product?.name}`;

  const handleShare = (platform) => {
    let url = "";
    switch (platform) {
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          productUrl
        )}`;
        onClose();
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          shareText
        )}&url=${encodeURIComponent(productUrl)}`;
        onClose();
        break;
      case "whatsapp":
        url = `https://api.whatsapp.com/send?text=${encodeURIComponent(
          `${shareText} ${productUrl}`
        )}`;
        onClose();
        break;
      case "linkedin":
        url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
          productUrl
        )}&title=${encodeURIComponent(product.name)}&summary=${encodeURIComponent(
          shareText
        )}`;
        onClose();
        break;
      case "pinterest":
        url = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
          productUrl
        )}&description=${encodeURIComponent(shareText)}`;
        onClose();
        break;
      case "reddit":
        url = `https://www.reddit.com/submit?url=${encodeURIComponent(
          productUrl
        )}&title=${encodeURIComponent(product.name)}`;
        onClose();
        break;
      case "telegram":
        url = `https://t.me/share/url?url=${encodeURIComponent(
          productUrl
        )}&text=${encodeURIComponent(shareText)}`;
        onClose();
        break;
      case "email":
        url = `mailto:?subject=${encodeURIComponent(product.name)}&body=${encodeURIComponent(`${shareText} ${productUrl}`)}`;
        onClose();
        break;

      default:
        onClose();
        break;
    }
    if (url) window.open(url, "_blank");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(productUrl);
    toast.success("Link copied to clipboard!"),
      {
        duration: 2000,
      };
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} closeAfterTransition>
      <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative"
          onClick={(e) => e.stopPropagation()}
        >
          <IoMdClose
            className=" text-gray-400 w-10 h-10 cursor-pointer  absolute top-1 right-1"
            onClick={() => onClose()}
          />
          <div>
            <h2 className="text-lg font-bold mt-[-10px]   mb-4">
              Share Product
            </h2>
          </div>
          <div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-3 gap-6 text-center">
            {[
              { name: "Facebook", icon: FaFacebook, platform: "facebook" },
              { name: "Twitter", icon: FaTwitter, platform: "twitter" },
              { name: "WhatsApp", icon: FaWhatsapp, platform: "whatsapp" },
              { name: "LinkedIn", icon: FaLinkedin, platform: "linkedin" },
              { name: "Pinterest", icon: FaPinterest, platform: "pinterest" },
              { name: "Reddit", icon: FaReddit, platform: "reddit" },
              { name: "Telegram", icon: FaTelegram, platform: "telegram" },
              { name: "Email", icon: FaEnvelope, platform: "email" },
            ].map(({ name, icon: Icon, platform }, index) => (
              <button
                key={index}
                onClick={() => handleShare(platform)}
                className="flex flex-col items-center text-gray-700 hover:text-blue-600"
              >
                <Icon className="w-9 h-9 mb-1 bg-gray-300 rounded-full shadow-lg shadow-gray-400 hover:shadow-blue-500/50 p-[6px] transition-shadow duration-300" />
                <span className="text-xs">{name}</span>
              </button>
            ))}
            <button
              onClick={handleCopy}
              className="flex flex-col items-center text-gray-600 hover:text-blue-600"
            >
              <FaCopy className="w-9 h-9 mb-1 bg-gray-300 rounded-full p-[6px] shadow-md shadow-gray-400 " />
              <span className="text-xs">Copy Link</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SocialMediaShareModal;
