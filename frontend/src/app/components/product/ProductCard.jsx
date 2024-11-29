import Image from "next/image";
import React from "react";
import Link from "next/link";

const ProductCard = ({
  cardImage = "allswell_image",
  banner_Text = false,
  // price = "$123",
  last_price = "$123",
  index,
  ...data
}) => {
  return (
    <>
      <div className="w-[394px] border  bg-[#EAE8E2] p-5 relative" key={index}>
        <Image
          src={data?.thumbnail ? data?.thumbnail : `/images/${cardImage}.png`}
          className="w-full h-[199px] "
          alt={cardImage}
          height={0}
          width={0}
          sizes="100vw"
        />
        {banner_Text && (
          <p className="px-2 py-1 text-white bg-[#FF004D] rounded-[2px] w-fit absolute top-[30px] left-8">
            {banner_Text}
          </p>
        )}
        <h2 className=" font-extrabold font-libre-franklin text-[24px] leading-[29.09px] text-[#171717] mt-5 py-1">
          {data?.title
            ? `${data.title.substring(0, 20)}${
                data.title.length > 20 ? "..." : ""
              }`
            : "Saatva Classic"}
        </h2>
        <p className=" font-poppins font-normal leading-[24px] text-[16px] mt-[10px] pr-5">
          {data?.description
            ? `${data.description.substring(0, 70)}${
                data.description.length > 70 ? "..." : ""
              }`
            : "Includes mattress (One or Dream), Foundation, and Mattress Protector."}
        </p>
        <p className="text-black font-poppins font-normal leading-[24px] text-[16px] mt-[12px]">
          <span className="text-black mr-1"> ✔</span>{" "}
          {data?.tags ? data?.tags[0] : "Foundation"}
        </p>
        <p className="text-black font-poppins font-normal leading-[24px] text-[16px] mt-[12px]">
          <span className="text-black mr-1"> ✔</span>{" "}
          {data?.tags ? data?.tags[1] : "Waterproof Mattress Protector"}
        </p>
        <hr className="w-full h-[2px] bg-[#7B6E62] mt-[15px]" />
        <div className="flex gap-x-5 items-center mt-[20px]">
          <h1 className="text-black font-poppins font-bold leading-[60px] text-[40px]  py-1">
            ${data?.price ? data?.price : "123"}
          </h1>
          <p className="text-[#7B6E62] font-poppins font-medium leading-[36px] text-[24px]  py-1">
            {last_price}
          </p>
        </div>
        <div className="w-full mt-[6px]">
          <Link href={`/product/${data?.id ? data?.id : index}`}>
            <button className="text-white font-poppins font-medium leading-[27px] text-[18px] h-[55px] bg-[#7B6E62] w-full">
              Add to Cart
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};
// const ProductCard = ({
//   cardImage = "allswell_image",
//   banner_Text = false,
//   last_price = "$123",
//   index,
//   ...data
// }) => {
//   console.log(data);

//   return (
//     <>
//       <div className="w-[394px] border  bg-[#EAE8E2] p-5 relative" key={index}>
//         <Image
//           // src={`/images/${cardImage}.png`}
//           src={`${data.images[0]}`}
//           className="w-full h-[199px] "
//           alt={cardImage}
//           height={0}
//           width={0}
//           sizes="100vw"
//         />
//         {(data?.id === 1 || data?.id === 5) && (
//           <p className="px-2 py-1 text-white bg-[#FF004D] rounded-[2px] w-fit absolute top-[30px] left-8">
//             {data?.id === 1 ? "On Sale" : "Special offer"}
//           </p>
//         )}
//         <h2 className=" font-extrabold font-libre-franklin text-[24px] leading-[29.09px] text-[#171717] mt-5 py-1">
//           {data?.title.length > 20
//             ? `${data.title.slice(0, 20)}...`
//             : data.title}
//         </h2>
//         <p className="font-poppins font-normal leading-[24px] text-[16px] mt-[10px] pr-5">
//           {data?.description.length > 80
//             ? `${data.description.slice(0, 80)}...`
//             : data.description}
//         </p>
//         <p className="text-black font-poppins font-normal leading-[24px] text-[16px] mt-[12px]">
//           <span className="text-black mr-1"> ✔</span>{" "}
//           {data?.tags[0] ? data?.tags[0] : "Foundation"}
//         </p>
//         <p className="text-black font-poppins font-normal leading-[24px] text-[16px] mt-[12px]">
//           <span className="text-black mr-1"> ✔</span>{" "}
//           {data?.tags[1] ? data?.tags[1] : "Waterproof Mattress Protector"}
//         </p>
//         <hr className="w-full h-[2px] bg-[#7B6E62] mt-[15px]" />
//         <div className="flex gap-x-5 items-center mt-[20px]">
//           <h1 className="text-black font-poppins font-bold leading-[60px] text-[40px]  py-1">
//             ${data?.discountPercentage}
//           </h1>
//           <p className="text-[#7B6E62] font-poppins font-medium leading-[36px] text-[24px]  py-1">
//             ${data?.price}
//           </p>
//         </div>
//         <div className="w-full mt-[6px]">
//           <Link href={`/product/${index}`}>
//             <button className="text-white font-poppins font-medium leading-[27px] text-[18px] h-[55px] bg-[#7B6E62] w-full">
//               Add to Cart
//             </button>
//           </Link>
//         </div>
//       </div>
//     </>
//   );
// };
export default ProductCard;
