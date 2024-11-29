import Image from "next/image";
import React from "react";

const AboutusCom = () => {
  return (
    <>
      <div className="mt-[100px]  container mx-auto ">
        <div className="flex w-full gap-20">
          <div className=" relative w-1/2">
            <div className="w-[364px] h-[357px] rounded-[10px] bg-[#7B6E62] ml-[19rem] mt-[189px]"></div>
            <div className=" absolute top-0 left-[8rem]">
              <Image
                src="/images/aboutus-one_bed.png"
                alt="aboutus-one_bed"
                className="w-[408px] h-[517px]"
                width={0}
                height={0}
                sizes="100vw"
              />
            </div>
            <div className=" absolute bottom-[-1.7rem] right-[-5.8rem]">
              <Image
                src="/images/aboutus_two_bed.png"
                alt="aboutus-one_bed"
                className="w-[350px] h-[385px]"
                width={0}
                height={0}
                sizes="100vw"
              />
            </div>
          </div>
          <div className="w-1/2 ml-24">
            <h2 className=" text-[#171717] font-libre-franklin font-extrabold  text-[44px] leading-[53.33px]">
              About Us
            </h2>
            <p className="w-[529px] pr-20 mt-[30px] font-poppins font-normal text-[20px] text-[#171717] leading-[30px] text-start">
              The mattress magic began in 2016 when Tuftzy launched. The goal
              was to make the most comfortable, yet affordable, memory foam
              mattresses you could buy online. Today, Tuftzy is America’s most
              awarded mattress. <br />
              <br /> We believe any person can be a morning person. Our
              award-winning mattress is designed for your sweetest sleep, so you
              can wake up leveled up. There’s no wrong side of this bed.
            </p>
            <div className="mt-[40px]">
              <div className="w-[530px] h-[153px] p-[25px] rounded-[10px] bottom-gradient-shadow  bg-[#F9F8F4] flex">
                <div className="flex gap-x-3 text-center ">
                  <div className="mt-5">
                    <h3 className="text-[#7B6E62] font-libre-franklin font-extrabold  text-[28px] leading-[33.94px]">
                      70,000+
                    </h3>
                    <p className="text-[#171717] font-libre-franklin font-extrabold  text-[18px] leading-[21.82px] mt-[10px]">
                      5-star reviews
                    </p>
                  </div>
                  <div className="w-[2px] h-[100px] mt-2 bg-[#7B6E62] opacity-20 ml-6 mr-5 "></div>
                </div>
                <div className="flex gapx-3 text-center ">
                  <div className="mt-5">
                    <h3 className="text-[#7B6E62] font-libre-franklin font-extrabold  text-[28px] leading-[33.94px]">
                      4M+
                    </h3>
                    <p className="text-[#171717] font-libre-franklin font-extrabold  text-[18px] leading-[21.82px] mt-[10px]">
                      Happy Sleepers
                    </p>
                  </div>
                  <div className="w-[2px] h-[100px] mt-2 bg-[#7B6E62] opacity-20 ml-5 mr-5"></div>
                </div>
                <div className="flex gapx-3 text-center mt-5">
                  <div>
                    <h3 className="text-[#7B6E62] font-libre-franklin font-extrabold  text-[28px] leading-[33.94px]">
                      107
                    </h3>
                    <p className="text-[#171717] font-libre-franklin font-extrabold  text-[18px] leading-[21.82px] mt-[10px]">
                      Awards
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutusCom;
