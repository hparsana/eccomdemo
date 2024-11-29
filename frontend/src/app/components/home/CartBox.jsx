"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

const CartBox = ({
  select = false,
  title = "",
  icon_image = "",
  sub_content = "",
  price = "",
  button_text = "",
  breakWord = false,
}) => {
  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 50, x: 100 }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 1.5 }}
      viewport={{ once: true }} // Only animate once
    >
      <div
        className={`w-[394px] h-[584px] bg-[#EAE8E2] flex flex-col px-5 ${
          select ? "border-[2px] border-[#7B6E62]" : null
        } `}
      >
        {select ? (
          <>
            <div className="flex justify-center -mt-[20px]">
              <div className="w-[261px] h-[39px] bg-[#7B6E62] ">
                <h2 className=" text-white text-center mt-[6px] font-Poppins font-semibold  text-[16px] leading-[24px]">
                  OUR NEWEST MATTRESS
                </h2>
              </div>
            </div>
          </>
        ) : null}

        <h3 className="font-libre-franklin font-extrabold text-[28px] text-[#171717] leading-[33.94px] mt-10 text-center">
          {title}
        </h3>
        <Image
          src={`/images/${icon_image}.png`}
          className="w-full h-[199px]  mt-[30px]"
          alt={icon_image}
          height={0}
          width={0}
          sizes="100vw"
        />
        <p
          className={`text-center font-Poppins  font-normal text-[16px] leading-[24px] mt-[18px] ${
            breakWord ? "px-10" : null
          }`}
        >
          {sub_content ? sub_content : ""}
        </p>
        <hr className="w-full h-[2px]  bg-[#7B6E62] mt-[18px]" />
        <p className="text-center font-Poppins  font-normal text-[16px] leading-[24px] mt-[18px]">
          Queen:
        </p>
        <h1 className="text-center  font-Poppins font-bold  text-[40px] leading-[60px]  text-[#171717]">
          {price}
        </h1>
        <div className="mt-5">
          <button className="w-full h-[55px] bg-[#7B6E62] text-white font-Poppins font-medium text-[18px] leading-[27px]">
            {button_text}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CartBox;
