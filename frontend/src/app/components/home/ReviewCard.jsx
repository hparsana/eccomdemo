import Image from "next/image";
import React from "react";

const ReviewCard = ({ index, ...data }) => {
  return (
    <>
      <div className="relative h-[450px]" key={index}>
        <div className="w-[395px] h-[320px]  bg-white rounded-[10px]">
          <div className="flex justify-center ">
            {[1, 2, 3, 4, 5].map((item, key) => {
              return (
                <span
                  className="start"
                  key={key}
                  style={{
                    cursor: "pointer",
                    color: "#FFC107",
                    fontSize: `33px`,
                  }}
                >
                  ★
                </span>
              );
            })}
          </div>
          <div className="mt-[30px]">
            <h6 className="font-poppins text-center font-medium italic text-[18px] leading-[27px] text-[#171717] px-5">
              “{data.quotes} “
            </h6>
            <h3 className="font-libre-franklin text-center font-extrabold text-[20px] leading-[24.24px] text-[#171717] px-5 mt-6">
              {data.type}
            </h3>
            <p className="font-poppins text-center font-normal text-[15px] leading-[22.5px] text-[#171717] px-5 mt-[6px]">
              {data.name}
            </p>
          </div>
        </div>
        <div className="flex justify-center w-fit">
          <Image
            src={`/images/${
              data.gender === "female" ? "girl_icon" : "boy_icon"
            }.png`}
            alt="bed_layer"
            className="w-[73px] h-[73px] -mt-[40px] ml-[155px]"
            width={0}
            height={0}
            sizes="100vw"
          />
        </div>
      </div>
    </>
  );
};

export default ReviewCard;
