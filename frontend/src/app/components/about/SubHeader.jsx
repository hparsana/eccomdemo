import Image from "next/image";
import React from "react";

const SubHeader = ({ title = "" }) => {
  return (
    <>
      <div className="w-full h-[338px] bg-[#EAE8E2] flex justify-center items-center relative ">
        <div className="text-center">
          <h1 className="font-libre-franklin font-extrabold text-[60px] text-[#171717] leading-[72.72px]  text-center">
            {title}
          </h1>
          <p className="mt-[10px] font-poppins font-normal text-[22px] leading-[40px] text-[#7B6E62]">
            Home <span className="text-[#171717]">/ {title}</span>
          </p>
        </div>
        <div className="  absolute right-[291px] bottom-[-15px]">
          <Image
            src="/images/fooldani.png"
            alt="fooldani"
            className="w-[138px] h-[312px]"
            width={0}
            height={0}
            sizes="100vw"
          />
        </div>
      </div>
    </>
  );
};

export default SubHeader;
