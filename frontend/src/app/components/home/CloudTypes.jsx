import Image from "next/image";
import React from "react";

const dataName = [
  {
    id: 1,
    title: "Breathable Cooling Cover",
  },
  {
    id: 2,
    title: "Therapeutic Gel-Infused Memory Foam",
  },
  {
    id: 3,
    title: "Dynamic Response Layer",
  },
  {
    id: 4,
    title: "ActiveSupport Stability Base Layer",
  },
  {
    id: 5,
    title: "Shift-Resistant Lower Cover",
  },
];
const CloudTypes = () => {
  return (
    <>
      <div className=" container mx-auto mt-[100px] mb-[100px]">
        <div className="flex justify-around items-center">
          <div>
            <h1 className="font-libre-franklin text-[44px] font-extrabold leading-[53.33px]  text-[#171717]">
              Experience the Cloud: <br className="m-0" /> Where Dreams Come
              True.
            </h1>

            {dataName.map((item, key) => {
              return (
                <>
                  <div
                    className="flex gap-x-[15px] items-center mt-[25px]"
                    key={key}
                  >
                    <div className="w-[39px] h-[39px] gradient-custom1 rounded-[10px] rotate-[-45deg] flex justify-center items-center">
                      <h5 className="font-poppins text-white font-semibold text-[20px] leading-[30px] rotate-[45deg]">
                        {item.id}
                      </h5>
                    </div>
                    <h3 className="font-poppins text-[#171717] font-normal text-[20px] leading-[30px] ml-2">
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

export default CloudTypes;
