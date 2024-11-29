import React from "react";

const QuestionsCard = () => {
  return (
    <>
      <div className="w-full">
        <div className="mx-auto">
          <div className="text-center py-[100px] bg-[url('/images/product/women_slepp_image.png')] bg-repeat  bg-cover h-[823px] object-cover">
            <div className="container mx-auto">
              <h1 className="font-libre-franklin font-extrabold text-[44px] leading-[53.33px] text-[#171717]">
                Frequently Asked Questions
              </h1>
              <p className="mt-[20px] font-poppins font-normal text-[20px] leading-[30px] text-[#171717]  mx-24">
                While the Original & The Casper has gone to bed, you can
                experience the latest in cutting-edge coziness with our new
                mattress, the One.you can experience the latest in cutting-edge
                coziness with our new mattress, the One.
              </p>
            </div>
          </div>
          <div className="flex justify-center gap-x-3 w-full">
            <div className="flex  ">
              <div className="mx-auto text-center mt-8 w-[332px]">
                <h3 className=" font-libre-franklin font-extrabold text-[28px] leading-[33.94px] text-[#171717]">
                  Cozy Cover
                </h3>
                <p className="w-[332px] text-center font-normal text-[20px] leading-[30px] text-[#171717] mt-[35px] px-5">
                  No delay between movement and mattress response means fewer
                  sleep disturbances.
                </p>
              </div>
              <div className="w-[1px] h-[280px] bg-[#7B6E62] opacity-30 mx-[30px]"></div>
            </div>

            <div className="flex  ">
              <div className="mx-auto text-center mt-8 w-[332px]">
                <h3 className=" font-extrabold text-[28px] leading-[33.94px] text-[#171717]">
                  Temperature balancing
                </h3>
                <p className="w-[332px] text-center font-normal text-[20px] leading-[30px] text-[#171717] mt-[35px] px-5">
                  Innovative materials help dissipate heat and prevent building
                  temperatures, unlike traditional mattresses.
                </p>
              </div>
              <div className="w-[1px] h-[280px] bg-[#7B6E62] opacity-30 mx-[30px]"></div>
            </div>
            <div className="flex  ">
              <div className="mx-auto text-center mt-8 w-[332px]">
                <h3 className="  font-extrabold text-[28px] leading-[33.94px] text-[#171717]">
                  Soothing pressure relief
                </h3>
                <p className="w-[332px] text-center font-normal text-[20px] leading-[30px] text-[#171717] mt-[35px] px-5">
                  Purple’s exclusive GelFlex® Grid conforms around joints and
                  pressure points for more comfortable nights and reduced aches
                  and pains.
                </p>
              </div>
              <div className="w-[1px] h-[280px] bg-[#7B6E62] opacity-30 mx-[30px]"></div>
            </div>
            <div className="flex  ">
              <div className="mx-auto text-center mt-8 w-[332px]">
                <h3 className="  font-extrabold text-[28px] leading-[33.94px] text-[#171717]">
                  Superior support
                </h3>
                <p className="w-[332px] text-center font-normal text-[20px] leading-[30px] text-[#171717] mt-[35px] px-5">
                  Stable Base Foam layers offer broad support to keep the body
                  aligned throughout the night.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionsCard;
