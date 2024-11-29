"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

const BannerSection = () => {
  return (
    <>
      <div className="bg-[#EAE8E2] w-full">
        <div className="container mx-auto h-fit ">
          <div className="flex justify-between items-center">
            <motion.div
              className="card"
              initial={{ opacity: 1, y: 50, x: -100 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 1.5 }}
              viewport={{ once: true }} // Only animate once
            >
              <div className="w-[715px] mt-[80px]">
                <h1 className="font-libre-franklin text-[60px] font-extrabold leading-[72.72px]">
                  Experience Sleep Innovation : <br className="mt-0" /> All
                  Fresh, All Luxe!
                </h1>

                <p className="font-poppins text-[26px] font-normal leading-[40px] pr-4 mt-[36px]">
                  Five Years of Dreamy Comfort: Celebrate with an Extraordinary
                  20% Off!
                </p>
              </div>
            </motion.div>
            <div className=" mt-[80px] mb-[78px]">
              <motion.div
                className="card"
                initial={{ opacity: 1, y: 50, x: 100, rotate: 180 }}
                whileInView={{ opacity: 1, y: 0, x: 0, rotate: 0 }}
                transition={{ duration: 1.5 }}
                viewport={{ once: true }} // Only animate once
              >
                <Image
                  src="/images/sofa.png"
                  alt="sofa"
                  className="w-[777px] h-fit"
                  width={0}
                  height={0}
                  sizes="100vw"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BannerSection;
