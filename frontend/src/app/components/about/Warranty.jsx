import Image from "next/image";
import React from "react";

const dataName = [
  {
    id: 1,
    icon: "dollar_icon_1",
    width: 35,
    title:
      "If you ever notice any flaws in workmanship or materials, just email or call, and Tuftzy will guide you through the next steps",
  },
  {
    id: 2,
    icon: "success_icon_2",
    width: 35,
    title:
      "If you’ve had it for 10 years or fewer, Tuftzy sends you a new mattress.",
  },
  {
    id: 3,
    icon: "repair_icon_3",
    width: 29,
    title: "After 10 years, Tuftzy fully repairs your mattress.",
  },
  {
    id: 4,
    icon: "shipping_truck_icon_4",
    width: 37,
    title: "Shipping is free - always.",
  },
];
const Warranty = () => {
  return (
    <>
      <div className=" container mx-auto mt-[100px] mb-[100px]">
        <div className="flex justify-center gap-x-12 items-center">
          <div className="w-[608px]">
            <h1 className=" text-[44px] font-extrabold leading-[53.33px]  text-[#171717]">
              If you have an issue during the Forever Warranty™...
            </h1>
            <p className=" font-poppins font-normal text-[20px] leading-[30px] mt-5 text-[#171717] w-[525px]">
              Call Us at{" "}
              <span className="text-[#7B6E62]"> 1-888-425-4854 </span> within
              your 365-night trial or email{" "}
              <span className="text-[#7B6E62]"> returns@Tuftzysleep.com</span>
            </p>
            {dataName.map((item, key) => {
              return (
                <>
                  <div
                    className="flex gap-x-[20px] items-center mt-[25px]"
                    key={key}
                  >
                    <div className="w-[50px] h-[50px] bg-gradient-to-b from-[#7B6E62] to-[#524941] rounded-[10px] rotate-[-45deg] flex justify-center items-center">
                      <Image
                        src={`/images/icons/${item.icon}.png`}
                        alt={item.icon}
                        className={` rotate-[45deg]`}
                        width={item.width}
                        height={item.width}
                        sizes="100vw"
                      />
                    </div>
                    <h3 className="font-poppins text-[#171717] font-normal text-[20px] leading-[30px] ml-2 w-[519px]">
                      {item.title}
                    </h3>
                  </div>
                </>
              );
            })}
          </div>
          <div className="text-center">
            <Image
              src="/images/bed_layer.png"
              alt="bed_layer"
              className="w-[606px] h-[374px] mt-5"
              width={0}
              height={0}
              sizes="100vw"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Warranty;
