import Image from "next/image";
import React from "react";

const StoryPart = () => {
  return (
    <>
      <h1 className="text-center text-[#171717] leading-[53.33px] text-[44px] font-libre-franklin font-extrabold mt-[100px]">
        Our story is your story.
      </h1>
      <div className="mt-[40px]">
        <div className=" w-full flex">
          <div className="w-1/6 relative">
            <Image
              src="/images/story_bed.png"
              alt="story_bed"
              className="w-[392px] absolute bottom-[33px]"
              height={0}
              width={0}
              sizes="100vw"
            />
          </div>
          <div className="w-3/4 flex justify-between">
            <Image
              src="/images/bed_sleep_gift.png"
              alt="bed_sleep_gift"
              className="w-[288px] h-[487px] rounded-[13px]"
              height={0}
              width={0}
              sizes="100vw"
            />
            <Image
              src="/images/bed_sleep_gift.png"
              alt="bed_sleep_gift"
              className="w-[288px] h-[487px] rounded-[13px]"
              height={0}
              width={0}
              sizes="100vw"
            />{" "}
            <Image
              src="/images/bed_sleep_gift.png"
              alt="bed_sleep_gift"
              className="w-[288px] h-[487px] rounded-[13px]"
              height={0}
              width={0}
              sizes="100vw"
            />{" "}
            <Image
              src="/images/bed_sleep_gift.png"
              alt="bed_sleep_gift"
              className="w-[288px] h-[487px] rounded-[13px]"
              height={0}
              width={0}
              sizes="100vw"
            />
          </div>
          <div className="w-1/6 mt-[33px]">
            <Image
              src="/images/story_bed.png"
              alt="story_bed"
              className="w-[392px]"
              height={0}
              width={0}
              sizes="100vw"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default StoryPart;
