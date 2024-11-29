import Image from "next/image";
import React from "react";

const Help_Deciding = () => {
  return (
    <div className="flex justify-center mt-[100px]">
      <div className="w-[1500px] h-[414px] bg-[#EAE8E2] rounded-[28px]">
        <div className="flex pl-[79px]">
          <Image
            src="/images/sofa_with_bed.png"
            alt={"sofa_with_bed"}
            className="w-[606px] h-[320px] mt-8"
            height={0}
            width={0}
            sizes="100vw"
          />
          <div className="w-full">
            <h1 className="text-center text-[#171717] leading-[48.48px] text-[40px] font-libre-franklin font-extrabold mt-[80px]">
              Need help deciding?
            </h1>
            <div className="grid grid-cols-3 w-[606px] mx-auto h-[146px] mt-[60px]">
              <div className="flex gap-x-2">
                <div className="mt-5">
                  <Image
                    src="/images/phone_icon.png"
                    alt={"phone_icon"}
                    className="mx-auto"
                    height={40}
                    width={40}
                  />
                  <h6 className=" text-[#171717] leading-[21.82px] text-[18px] font-libre-franklin font-extrabold mt-[35px]">
                    Give us a ring
                  </h6>
                </div>
                <div className="w-[2px] ml-[35px] h-26 bg-slate-400 opacity-15"></div>
              </div>
              <div className="flex gap-x-2 ml-4">
                <div className="mt-5">
                  <Image
                    src="/images/sms_icon.png"
                    alt={"sms_icon"}
                    className="mx-auto"
                    height={40}
                    width={40}
                  />
                  <h6 className=" text-[#171717] leading-[21.82px] text-[18px] font-libre-franklin font-extrabold mt-[35px]">
                    Give us a ring
                  </h6>
                </div>
                <div className="w-[2px] ml-[35px] h-26 bg-slate-400 opacity-15"></div>
              </div>
              <div className="flex gap-x-2 ml-7">
                <div className="mt-5">
                  <Image
                    src="/images/user_icon.png"
                    alt={"user_icon"}
                    className="mx-auto"
                    height={40}
                    width={40}
                  />
                  <h6 className=" text-[#171717] leading-[21.82px] text-[18px] font-libre-franklin font-extrabold mt-[35px]">
                    Give us a ring
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help_Deciding;
