"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const ProDetailsCard = ({ productId }) => {
  const [mattress, setMetress] = useState(1);
  const [mainImage, setMainImage] = useState("prodetails_main_bed");

  const [size, setSize] = useState(5);
  const [height, setHeight] = useState(1);
  const [level, setLevel] = useState(1);
  const [data, setCurrentItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(
          `https://dummyjson.com/products/${productId}`
        );
        const data = await response.json();
        // Assuming the API response structure includes a 'products' array
        setCurrentItems(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchItems();
    console.log(">>>>>>>>>>>>>>", productId);
  }, [productId]);
  return (
    <>
      <div className="container mx-auto flex ">
        <div className="flex w-full ">
          <div className="w-3/5 flex justify-center">
            <div>
              <Image
                src={`/images/product/${mainImage}.png`}
                className="w-[712px] h-[419px] "
                alt={mainImage}
                height={0}
                width={0}
                sizes="100vw"
              />
              <div className="w-full flex items-center mt-5 gap-x-5">
                {[
                  { id: 1, imgUrl: "product_img_1" },
                  { id: 2, imgUrl: "product_img_2" },
                  { id: 3, imgUrl: "product_img_3" },
                  { id: 4, imgUrl: "product_img_4" },
                  { id: 5, imgUrl: "product_img_5" },
                  { id: 6, imgUrl: "product_img_6" },
                ].map((item, key) => {
                  return (
                    <div key={key}>
                      <Image
                        src={`/images/product/${item.imgUrl}.png`}
                        className={`w-[102px] h-[69px] border-[2px] cursor-pointer ${
                          item.imgUrl === mainImage ? "border-[#161515]" : null
                        } `}
                        alt={item.imgUrl}
                        height={0}
                        width={0}
                        sizes="100vw"
                        onClick={() => setMainImage(item.imgUrl)}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="w-full flex items-center gap-x-2 mt-[75px] ">
                {[
                  {
                    id: 1,
                    imgUrl: "freeTruck_icon_1",
                    title: "Free shipping and returns*",
                  },
                  {
                    id: 2,
                    imgUrl: "hundred_icon_2",
                    title: "100-night risk free mattress trial",
                  },
                  {
                    id: 3,
                    imgUrl: "warranty_icon_3",
                    title: "10 Year Limited Mattress Warranty*",
                  },
                  {
                    id: 4,
                    imgUrl: "currency_icon_4",
                    title: "Quick, simple financing options",
                  },
                  {
                    id: 5,
                    imgUrl: "frame_icon_5",
                    title: "Compatible with most bed frames",
                  },
                ].map((item, key) => {
                  return (
                    <div className="w-1/5 flex items-center" key={key}>
                      <div className="w-[125px]">
                        <Image
                          src={`/images/product/${item.imgUrl}.png`}
                          className="w-fit h-fit mx-auto"
                          alt={item.imgUrl}
                          height={0}
                          width={0}
                          sizes="100vw"
                        />
                        <p className="mt-[13px] font-libre-franklin font-medium text-[13px] leading-[15px] text-[#171717] text-center px-1">
                          {item.title}
                        </p>
                      </div>

                      {item.id !== 5 ? (
                        <div className="bg-[#7B6E62] w-[1px] h-[100px] opacity-20 ml-3"></div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
              <div className="mt-[84px] w-full bg-[#EAE8E2]">
                <h2 className=" font-poppins font-semibold text-[18px] leading-[27px] text-[#171717] text-center px-[45px] py-[28px]">
                  Awarded “Best Overall Mattress in 2024” by Good Morning
                  America
                </h2>
              </div>
            </div>
          </div>
          <div className="w-2/5">
            <div className="w-full">
              <h1 className="font-libre-franklin font-extrabold text-[40px] leading-[48.48px] text-[#171717]">
                {data?.title}
              </h1>
              <p className="font-poppins font-normal text-[16px] leading-[24px] text-[#171717] mt-[18px]">
                America&apos;s best-selling online luxury innerspring
              </p>
              <div className="flex items-center gap-x-4 ">
                <div className="flex">
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
                <h5 className="font-poppins font-extrabold text-[13px] leading-[19.5px] text-[#171717] mt-1">
                  45k <span className=" font-normal"> Saatva Reviews</span>
                </h5>
              </div>
              <div className="flex mt-[30px] items-center gap-x-5">
                <h1 className="font-poppins font-bold text-[40px] leading-[60px] text-[#171717]">
                  ${data?.price}
                </h1>
                <h3 className="font-poppins font-medium text-[24px] leading-[36px] text-[#171717] opacity-50">
                  <del> ${Number((data?.price / 2) * 3).toFixed(1)}</del>
                </h3>
                <button className="py-1 px-3 font-poppins font-medium text-[13px] leading-[19px] text-white bg-[#007C01] rounded-[5px]">
                  Saved $200
                </button>
              </div>
              <div className="mt-10">
                <p className="font-poppins font-normal text-[16px] leading-[24px] text-[#171717] ">
                  Choose your mattress:
                </p>
                <div className="mt-[10px] w-[500px] flex border border-[#7B6E62] h-[73px] rounded-[8px]">
                  <div
                    className={`w-1/2 ${
                      mattress === 1
                        ? "bg-[#7B6E62] transition-colors duration-300"
                        : "transition-colors duration-300"
                    } rounded-[8px] text-center h-full cursor-pointer`}
                    onClick={() => setMetress(1)}
                  >
                    <h2
                      className={`font-poppins font-semibold text-[16px] leading-[16px] mt-4 ${
                        mattress === 1 ? "text-white" : null
                      }`}
                    >
                      One Foam
                    </h2>
                    <h2
                      className={`font-poppins font-normal text-[16px] leading-[16px] mt-[9px] ${
                        mattress === 1 ? "text-white" : null
                      }`}
                    >
                      Best-Selling Bundle
                    </h2>
                  </div>
                  <div
                    className={`w-1/2 ${
                      mattress === 2
                        ? "bg-[#7B6E62] transition-colors duration-300"
                        : "transition-colors duration-300"
                    } rounded-[8px] text-center h-full cursor-pointer`}
                    onClick={() => setMetress(2)}
                  >
                    <h2
                      className={`font-poppins font-semibold text-[16px] leading-[16px] mt-4 ${
                        mattress === 2 ? "text-white" : null
                      }`}
                    >
                      Dream Hybrid
                    </h2>
                    <h2
                      className={`font-poppins font-normal text-[16px] leading-[16px] mt-[9px] ${
                        mattress === 2 ? "text-white" : null
                      }`}
                    >
                      Best-Selling Bundle
                    </h2>
                  </div>
                </div>
              </div>
              <div className="mt-10">
                <p className="font-poppins font-normal text-[16px] leading-[24px] text-[#171717] ">
                  Select your size:
                </p>
                <div className="w-full mt-3">
                  <div className="flex justify-between flex-wrap w-[500px] gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, key) => {
                      return (
                        <button
                          key={key}
                          className={`border border-[#7B6E62] h-[46px] w-[152px] rounded-[3px] font-poppins font-semibold text-[16px] leading-[24px]  ${
                            size === item
                              ? "bg-[#7B6E62] text-white"
                              : "text-[#7B6E62]"
                          } `}
                          onClick={() => setSize(item)}
                        >
                          Twin
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="mt-10">
                <p className="font-poppins font-normal text-[16px] leading-[24px] text-[#171717] ">
                  Select mattress height
                </p>
                <div className="w-full mt-3">
                  <div className="flex justify-between flex-wrap w-[500px] ">
                    {[
                      { id: 1, title: "11.5" },
                      { id: 2, title: "14.5" },
                    ].map((item, key) => {
                      return (
                        <button
                          key={key}
                          className={`border border-[#7B6E62] h-[46px] w-[232px] rounded-[3px] font-poppins font-semibold text-[16px] leading-[24px]  ${
                            height === item.id
                              ? "bg-[#7B6E62] text-white"
                              : "text-[#7B6E62]"
                          } `}
                          onClick={() => setHeight(item.id)}
                        >
                          {item.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="mt-10">
                <p className="font-poppins font-normal text-[16px] leading-[24px] text-[#171717] ">
                  Select comfort level
                </p>
                <div className="w-full mt-3">
                  <div className="flex justify-between flex-wrap w-[500px]">
                    {[
                      { id: 1, title: "Plush Soft" },
                      { id: 2, title: "Luxury Firm" },
                      { id: 3, title: "Firm" },
                    ].map((item, key) => {
                      return (
                        <button
                          key={key}
                          className={`border border-[#7B6E62] h-[46px] w-[152px] rounded-[3px] font-poppins font-semibold text-[16px] leading-[24px]  ${
                            level === item.id
                              ? "bg-[#7B6E62] text-white"
                              : "text-[#7B6E62]"
                          } `}
                          onClick={() => setLevel(item.id)}
                        >
                          {item.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="mt-10 w-[500px] flex justify-center items-center gap-x-4">
                <Image
                  src={`/images/product/freeTruck_icon_1.png`}
                  className="w-[44.51px] h-[26.06px] "
                  alt={"freeTruck_icon_1"}
                  height={0}
                  width={0}
                  sizes="100vw"
                />
                <h4 className=" font-poppins font-normal text-[16px] leading-6 text-[#171717]">
                  {" "}
                  Made to order & delivered within 1-3 weeks
                </h4>
              </div>
              <div className="w-[500px] mt-10">
                <Link href={`/product/4`}>
                  <button className="text-white font-poppins font-medium leading-[27px] text-[18px] h-[55px] bg-[#7B6E62] w-full">
                    Add Item to Cart
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProDetailsCard;
