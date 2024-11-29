import Image from "next/image";
import React from "react";

const Mattress = () => {
  return (
    <div className="w-full">
      <div className="w-[1242px] h-[164px] mx-auto bg-[#F9F8F4] mt-[105px] rounded-[10px] relative bottom-gradient-shadow">
        <div className=" flex w-full">
          <div className=" flex flex-col justify-center w-full px-[25px] ">
            <div className="w-[69px] ml-[56px] h-[69px] rounded-[10px] bg-custom-gradient -mt-[35px] flex justify-center items-center ">
              <Image
                src="/images/truck_icon.png"
                className=""
                alt="truck_icon"
                height={26.06}
                width={44.51}
              />
            </div>
            <div className="flex">
              <h6 className="font-libre-franklin text-[18px] font-extrabold leading-[21.82px]  text-[#171717] w-[195px] mt-[30px] text-center">
                Free shipping and returns*
              </h6>
              <div className="w-[2px] opacity-20 h-24 bg-[#7B6E62] ml-[27px]"></div>
            </div>
          </div>
          <div className=" flex flex-col justify-center w-full">
            <div className="w-[69px] ml-[56px] h-[69px] rounded-[10px] bg-custom-gradient -mt-[35px] flex justify-center items-center ">
              <Image
                src="/images/night_risk_icon.png"
                className=""
                alt="night_risk_icon"
                height={26.06}
                width={44.51}
              />
            </div>
            <div className="flex">
              <h6 className="font-libre-franklin text-[18px] font-extrabold leading-[21.82px]  text-[#171717] w-[195px] mt-[30px] text-center">
                100-night risk free mattress trial
              </h6>
              <div className="w-[2px] opacity-20 h-24 bg-[#7B6E62] ml-[27px]"></div>
            </div>
          </div>
          <div className=" flex flex-col justify-center w-full ml-[26px]">
            <div className="w-[69px] ml-[56px] h-[69px] rounded-[10px] bg-custom-gradient -mt-[35px] flex justify-center items-center ">
              <Image
                src="/images/warrenty_icon.png"
                className=""
                alt="warrenty_icon"
                width={29.65}
                height={38.83}
              />
            </div>
            <div className="flex">
              <h6 className="font-libre-franklin text-[18px] font-extrabold leading-[21.82px]  text-[#171717] w-[195px] mt-[30px] text-center">
                10 Year Limited Mattress Warranty*
              </h6>
              <div className="w-[2px] opacity-20 h-24 bg-[#7B6E62] ml-[27px]"></div>
            </div>
          </div>{" "}
          <div className=" flex flex-col justify-center w-full ml-[26px]">
            <div className="w-[69px] ml-[56px] h-[69px] rounded-[10px] bg-custom-gradient -mt-[35px] flex justify-center items-center ">
              <Image
                src="/images/financing_icon.png"
                className=""
                alt="financing_icon"
                height={26.06}
                width={44.51}
              />
            </div>
            <div className="flex">
              <h6 className="font-libre-franklin text-[18px] font-extrabold leading-[21.82px]  text-[#171717] w-[195px] mt-[30px] text-center">
                Quick, simple financing options
              </h6>
              <div className="w-[2px] opacity-20 h-24 bg-[#7B6E62] ml-[27px]"></div>
            </div>
          </div>
          <div className=" flex flex-col justify-center w-full ml-[10px]">
            <div className="w-[69px] ml-[56px] h-[69px] rounded-[10px] bg-custom-gradient -mt-[56px] flex justify-center items-center ">
              <Image
                src="/images/bed_icon.png"
                className=""
                alt="bed_icon"
                height={26.06}
                width={44.51}
              />
            </div>

            <h6 className="font-libre-franklin text-[18px] font-extrabold leading-[21.82px]  text-[#171717] w-[195px] mt-[30px] text-center">
              Compatible with most bed frames
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mattress;
