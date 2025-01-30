"use client";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import Link from "next/link";

const DealsOfTheDay = () => {
  // Slick Carousel settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-8">
          Deals of the Day
        </h2>
        <Slider {...settings}>
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="px-2" // Add padding between slides
            >
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md ">
                <Image
                  src={`https://picsum.photos/300/200?random=${index + 4}`}
                  alt={`Deal ${index + 1}`}
                  width={300}
                  height={200}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Deal {index + 1}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Limited time offer
                  </p>
                  <div className="mt-5">
                    <Link
                      href="/productdata"
                      className=" bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default DealsOfTheDay;
