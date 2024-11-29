import Image from "next/image";
import React from "react";
import { FaTelegramPlane } from "react-icons/fa";
import { FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
const Footer = () => {
  return (
    <>
      <div className="w-full md:h-[517px] bg-[#171717]">
        <div className=" container mx-auto">
          <div className="w-full flex mx-32">
            <div className="w-1/4 mt-[80px]">
              <Image
                src="/images/tuftzy_footer.png"
                alt="tuftzy_footer"
                height={72}
                width={167}
              />
              <div className="mt-[55px] relative">
                <input
                  placeholder="enter your email address"
                  className="w-[321px] h-[54px] rounded-[6px] py-[15px] pl-[18px] pr-[70px] border-none"
                />
                <div className=" absolute bg-[#DEC9BB] w-[54px] h-[54px] left-[268px] top-0 rounded-tr-[6px] rounded-br-[6px] flex justify-center items-center">
                  <FaTelegramPlane className="w-[25.04px] h-6 text-white" />
                </div>
              </div>
              <div className="mt-[30px] flex gap-x-4">
                <div className="w-[44px] h-[44px] bg-[#7B6E62] rounded-full flex justify-center items-center cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110 hover:bg-[#8C7B6A]">
                  <FaFacebookF className="w-[10px] h-[19.26px] text-white" />
                </div>

                <div className="w-[44px] h-[44px] bg-[#7B6E62] rounded-full flex justify-center items-center cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110 hover:bg-[#8C7B6A]">
                  <FaLinkedinIn className="w-[18px] h-[18px] text-white" />
                </div>
                <div className="w-[44px] h-[44px] bg-[#7B6E62] rounded-full flex justify-center items-center cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110 hover:bg-[#8C7B6A]">
                  <FaInstagram className="w-[18.01px] h-[18.01px] text-white" />
                </div>
                <div className="w-[44px] h-[44px] bg-[#7B6E62] rounded-full flex justify-center items-center cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110 hover:bg-[#8C7B6A]">
                  <BsTwitterX className="w-[19.39px] h-[19.81px] text-white" />
                </div>
              </div>
            </div>
            <div className="w-2/3 grid grid-cols-4 mt-[80px] ml-10">
              <div>
                <h3 className="text-white text-[18px] font-extrabold font-libre-franklin">
                  Products
                </h3>
                {[
                  { id: 1, title: "Mattress" },
                  { id: 2, title: "Foundation" },
                  { id: 3, title: "Pillows" },
                  { id: 4, title: "Sheets" },
                  { id: 5, title: "Bedroom Set" },
                  { id: 6, title: "Nightstand" },
                ].map((item, index) => {
                  return (
                    <p
                      className={`text-[#DEC9BB] hover:text-red-200 text-[16px] font-normal leading-[24px] font-poppins cursor-pointer ${
                        index === 0 ? "mt-[18px]" : "mt-[12px]"
                      }`}
                      key={item?.id}
                    >
                      {item?.title}
                    </p>
                  );
                })}
              </div>
              <div>
                <h3 className="text-white text-[18px] font-extrabold font-libre-franklin">
                  Shop by Size
                </h3>
                {[
                  { id: 1, title: "Twin" },
                  { id: 2, title: "Twin XL" },
                  { id: 3, title: "Full" },
                  { id: 4, title: "Queen" },
                  { id: 5, title: "King" },
                ].map((item, index) => {
                  return (
                    <p
                      className={`text-[#DEC9BB] hover:text-red-200 text-[16px] font-normal leading-[24px] font-poppins cursor-pointer ${
                        index === 0 ? "mt-[18px]" : "mt-[12px]"
                      }`}
                      key={item.id}
                    >
                      {item?.title}
                    </p>
                  );
                })}
              </div>
              <div>
                <h3 className="text-white text-[18px] font-extrabold font-libre-franklin">
                  Support
                </h3>
                {[
                  { id: 1, title: "FAQs" },
                  { id: 2, title: "Find Stores" },
                  { id: 3, title: "Track Your Order" },
                  { id: 4, title: "Discount Programs" },
                  { id: 5, title: "Returns + Exchanges" },
                  { id: 6, title: "Refer a Friend" },
                  { id: 7, title: "Extend Protection Plan" },
                ].map((item, index) => {
                  return (
                    <p
                      className={`text-[#DEC9BB] hover:text-red-200 text-[16px] font-normal leading-[24px] font-poppins cursor-pointer ${
                        index === 0 ? "mt-[18px]" : "mt-[12px]"
                      }`}
                      key={item.id}
                    >
                      {item?.title}
                    </p>
                  );
                })}
              </div>
              <div>
                <h3 className="text-white text-[18px] font-extrabold font-libre-franklin">
                  Contact
                </h3>
                {[
                  { id: 1, title: "Call us" },
                  { id: 2, title: "Chat with us" },
                  { id: 3, title: "Email us" },
                ].map((item, index) => {
                  return (
                    <p
                      className={`text-[#DEC9BB] hover:text-red-200 text-[16px] font-normal leading-[24px] font-poppins cursor-pointer ${
                        index === 0 ? "mt-[18px]" : "mt-[12px]"
                      }`}
                      key={item.id}
                    >
                      {item?.title}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-[30px] w-full">
          <div className=" relative">
            <Image
              src="/images/footer_line_bed.png"
              alt="footer_line_bed"
              className="w-full"
              height={0}
              width={0}
              sizes="100vw"
            />
            <p className="text-white text-[16px] font-normal leading-[24px] font-poppins absolute top-20 left-[32rem]">
              Copyright © 2022 Tuftzy - All Rights Reserved.
            </p>
            <p className="text-white text-[16px] font-normal leading-[24px] font-poppins absolute top-20 right-[319px]">
              Privacy Policy | Terms & Conditions
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
