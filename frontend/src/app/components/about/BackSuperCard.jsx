import Image from "next/image";
import React from "react";

const BackSuperCard = ({
  addBG = true,
  backImage = "about_back_reverse_bed",
  mainTitle = "",
  title_1 = "",
  title_2 = "",
  title_3 = "",
}) => {
  return (
    <>
      <div
        className={`${
          addBG
            ? "bg-[url('/images/about_back_bed.png')]"
            : "bg-[url('/images/about_back_reverse_bed.png')]"
        } bg-repeat  bg-cover w-full ${
          addBG ? "h-[600px]" : "h-[700px]"
        } mt-[120px] flex`}
      >
        <div className=" container mx-auto">
          <h1 className=" font-extrabold text-[44px] text-white leading-[53.33px]  text-center mt-[120px] ">
            {mainTitle}
          </h1>
          <div className="flex justify-center px-16 gap-[3.5rem] mt-[70px] relative">
            <div
              className={`w-[390px] h-[288px] flex flex-col     ${
                addBG
                  ? "bg-[#EAE8E2] rounded-[10px] border-gradient-bottom "
                  : null
              }`}
            >
              <div className="w-[80px] h-[80px] mx-auto mt-[34px] rounded-[10px] bg-custom-gradient2 flex justify-center items-center ">
                <Image
                  src={`/images/${addBG ? "sms_chat_icon" : "like_icon"}.png`}
                  alt="sms_chat_icon"
                  className="w-[49px] h-[49px] "
                  width={0}
                  height={0}
                  sizes="100vw"
                />
              </div>
              {addBG ? null : (
                <h2 className=" text-white font-extrabold text-[28px] leading-[33.94px] text-center mt-[33px]">
                  9 out of 10
                </h2>
              )}
              <p
                className={`px-[28px] ${addBG ? "mt-[28px]" : "mt-[13px]"} ${
                  addBG ? "text-[#171717]" : "text-white"
                }  font-normal text-[20px] leading-[30px] font-poppins text-center`}
              >
                {title_1}
              </p>
            </div>
            {addBG ? null : (
              <div className="w-[2px] h-[300px] bg-[#EAE8E2] opacity-20"></div>
            )}

            <div
              className={`w-[390px] h-[288px] flex flex-col        ${
                addBG
                  ? "bg-[#EAE8E2] rounded-[10px] border-gradient-bottom "
                  : null
              }`}
            >
              <div className="w-[80px] h-[80px] mx-auto mt-[34px] rounded-[10px] bg-custom-gradient2 flex justify-center items-center ">
                <Image
                  src={`/images/${
                    addBG ? "hands_heart_icon" : "like_icon"
                  }.png`}
                  alt="hands_heart_icon"
                  className="w-[49px] h-[49px]"
                  width={0}
                  height={0}
                  sizes="100vw"
                />
              </div>
              {addBG ? null : (
                <h2 className=" text-white font-extrabold text-[28px] leading-[33.94px] text-center mt-[33px]">
                  9 out of 10
                </h2>
              )}
              <p
                className={`px-[28px] ${addBG ? "mt-[28px]" : "mt-[13px]"} ${
                  addBG ? "text-[#171717]" : "text-white"
                }  font-normal text-[20px] leading-[30px] font-poppins text-center`}
              >
                {title_2}
              </p>
            </div>
            {addBG ? null : (
              <div className="w-[2px] h-[300px] bg-[#EAE8E2] opacity-20"></div>
            )}
            <div
              className={`w-[390px] h-[288px]  flex flex-col      ${
                addBG
                  ? "bg-[#EAE8E2] rounded-[10px] border-gradient-bottom "
                  : null
              }`}
            >
              <div className="w-[80px] h-[80px] mx-auto mt-[34px] rounded-[10px] bg-custom-gradient2 flex justify-center items-center ">
                <Image
                  src={`/images/${addBG ? "dollar_icon" : "like_icon"}.png`}
                  alt="dollar_icon"
                  className="w-[49px] h-[49px]"
                  width={0}
                  height={0}
                  sizes="100vw"
                />
              </div>
              {addBG ? null : (
                <h2 className=" text-white font-extrabold text-[28px] leading-[33.94px] text-center mt-[33px]">
                  9 out of 10
                </h2>
              )}
              <p
                className={`px-[28px] ${addBG ? "mt-[28px]" : "mt-[13px]"} ${
                  addBG ? "text-[#171717]" : "text-white"
                }  font-normal text-[20px] leading-[30px] font-poppins text-center`}
              >
                {title_3}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BackSuperCard;
