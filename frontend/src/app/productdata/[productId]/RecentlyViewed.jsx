import Image from "next/image";
import { redirect } from "next/navigation";
import Slider from "react-slick";

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
  arrows: false, // Enable next/prev arrows

  responsive: [
    {
      breakpoint: 1424,
      settings: { slidesToShow: 4 },
    },
    {
      breakpoint: 1024,
      settings: { slidesToShow: 3 },
    },
    {
      breakpoint: 740,
      settings: { slidesToShow: 2 },
    },
    {
      breakpoint: 600,
      settings: { slidesToShow: 1 },
    },
  ],
};
const handleInterestedClick = (id) => {
  redirect(`/productdata/${id}`);
};
export default function RecentlyViewed({ recentViews }) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Recently Viewed</h2>
        <button className="text-blue-600 font-medium hover:underline">
          VIEW ALL
        </button>
      </div>
      <Slider {...settings} className="recently-viewed-slider ">
        {recentViews.map((item, index) => (
          <div
            key={index}
            className="min-w-[250px] max-w-[200px] bg-white rounded-lg shadow-sm border border-gray-200"
          >
            {/* Product Image */}
            <div className="relative w-full h-[150px]">
              <Image
                src={item?.image}
                alt={item?.name}
                fill
                className="object-cover rounded-t-lg"
              />
            </div>

            {/* Product Details */}
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
                {item?.name}
              </h3>
              <div className="flex items-center mt-2">
                <span className="text-xs font-medium text-white bg-green-500 px-2 py-0.5 rounded">
                  {item?.rating || "4.0"}
                </span>
                <span className="ml-2 text-xs text-gray-500">
                  ({item?.reviews || "500"} Reviews)
                </span>
              </div>
              <div className="mt-2">
                <span className="text-lg font-bold text-gray-800">
                  ₹{item?.price}
                </span>
                {item?.originalPrice && (
                  <span className="text-sm text-gray-500 line-through ml-2">
                    ₹{item?.originalPrice}
                  </span>
                )}
                <div className="w-full mt-1">
                  <button
                    className="bg-blue-400 text-white w-full py-1"
                    onClick={() => handleInterestedClick(item?._id)}
                  >
                    View Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
