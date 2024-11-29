"use client";
import React from "react";
import ReviewCard from "./ReviewCard";
// import Carousel from "react-multi-carousel";
// import "react-multi-carousel/lib/styles.css";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
const CustomerReview = () => {
  return (
    <div className="bg-[#EAE8E2] w-full flex">
      <div className="h-[870px] container mx-auto ">
        <h1 className="text-center text-[#171717] leading-[53.33px] text-[44px] font-libre-franklin font-extrabold mt-[100px]">
          Customers love us
        </h1>
        <div className="mt-[50px] w-full flex justify-center carous_review">
          <Carousel showArrows={true}>
            {[1, 2, 3].map((items, index) => {
              return (
                <div
                  className=" grid grid-cols-3 gap-0 ml-20 h-full"
                  key={items}
                >
                  {[
                    {
                      id: 1,
                      quotes:
                        "I actually had to hunt down the AirBNB we stayed at to find this mattress. We had tried 3 others and they couldn't compete...I'd pay double for this bed.",
                      type: "Karie",
                      name: "Port Charlotte, Florida",
                      gender:
                        index === 0
                          ? "female"
                          : index === 1
                          ? "male"
                          : "female",
                    },
                    {
                      id: 2,
                      quotes:
                        "I actually had to hunt down the AirBNB we stayed at to find this mattress. We had tried 3 others and they couldn't compete...I'd pay double for this bed.",
                      type: "Karie",
                      name: "Port Charlotte, Florida",
                      gender: "female",
                    },
                    {
                      id: 3,
                      quotes:
                        "I actually had to hunt down the AirBNB we stayed at to find this mattress. We had tried 3 others and they couldn't compete...I'd pay double for this bed.",
                      type: "Karie",
                      name: "Port Charlotte, Florida",
                      gender: "male",
                    },
                  ].map((itemsData, index1) => {
                    return (
                      <ReviewCard {...itemsData} index={index1} key={index1} />
                    );
                  })}
                </div>
              );
            })}
          </Carousel>
        </div>
        <div className="flex justify-center">
          <button className="text-center text-white leading-[27px] text-[18px] font-poppins font-medium mt-[60px] w-[235px] bg-[#7B6E62] h-[55px]">
            View All Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerReview;
