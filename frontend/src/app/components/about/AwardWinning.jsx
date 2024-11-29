"use client";
import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

import Image from "next/image";
const AwardWinning = () => {
  return (
    <>
      <div className="w-full bg-[#EAE8E2] flex">
        <div className="container mx-auto mb-[112px]">
          <h1 className=" w-full text-center text-[44px] font-extrabold  leading-[53.33px] mt-[100px]  text-[#171717]">
            Award-Winning Layers Of Comfort.
          </h1>
          <div className="mt-[77px] flex carousal_awardwin justify-center  ">
            <Carousel
              showArrows={true}
              showThumbs={false}
              className="w-[1350px]"
            >
              {[1, 2, 3].map((items, index) => {
                return (
                  <>
                    <div className="flex h-full ml-28" key={index}>
                      {[1, 2, 3, 4, 5, 6].map((itemsData, index1) => {
                        return (
                          <>
                            <div className="flex items-center " key={index1}>
                              <Image
                                src="/images/award_winning.png"
                                alt="award_winning"
                                className="w-[119px] h-[119px]"
                                width={0}
                                height={0}
                                sizes="100vw"
                              />
                              {itemsData !== 6 ? (
                                <div className="w-[2px] h-[100px] bg-[#7B6E62] opacity-15 mx-10"></div>
                              ) : null}
                            </div>
                          </>
                        );
                      })}
                    </div>
                  </>
                );
              })}
            </Carousel>
          </div>
        </div>
      </div>
    </>
  );
};

export default AwardWinning;
