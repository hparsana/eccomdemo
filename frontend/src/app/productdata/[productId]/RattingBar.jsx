import { FaStar } from "react-icons/fa";

const RatingsAndReviews = ({ category }) => {
  const categoryData = {
    phone: {
      overallRating: 4,
      totalRatings: "5,73,045",
      totalReviews: "42,338",
      features: [
        { label: "Sound Quality", rating: 4.5, color: "text-blue-500" },
        { label: "Battery Life", rating: 4.2, color: "text-green-500" },
        { label: "Design", rating: 4.6, color: "text-yellow-500" },
        { label: "Performance", rating: 4.4, color: "text-red-500" },
      ],
      highlight: "Premium sound and battery life make it a must-have gadget.",
    },
    clothes: {
      overallRating: 4.2,
      totalRatings: "3,20,045",
      totalReviews: "18,233",
      features: [
        { label: "Comfort", rating: 4.6, color: "text-green-500" },
        { label: "Style", rating: 4.7, color: "text-purple-500" },
        { label: "Durability", rating: 4.3, color: "text-orange-500" },
        { label: "Fit", rating: 4.5, color: "text-blue-500" },
      ],
      highlight: "Stylish and comfortable clothing for every occasion.",
    },
    electronics: {
      overallRating: 4.1,
      totalRatings: "4,10,000",
      totalReviews: "25,000",
      features: [
        { label: "Reliability", rating: 4.3, color: "text-red-500" },
        { label: "Build Quality", rating: 4.5, color: "text-green-500" },
        { label: "Performance", rating: 4.6, color: "text-blue-500" },
        { label: "Value for Money", rating: 4.4, color: "text-yellow-500" },
      ],
      highlight: "High-performance electronics with unbeatable value.",
    },
    shoes: {
      overallRating: 4.3,
      totalRatings: "2,73,000",
      totalReviews: "15,000",
      features: [
        { label: "Comfort", rating: 4.7, color: "text-purple-500" },
        { label: "Durability", rating: 4.5, color: "text-orange-500" },
        { label: "Style", rating: 4.6, color: "text-green-500" },
        { label: "Grip", rating: 4.8, color: "text-red-500" },
      ],
      highlight: "Durable and stylish shoes for all terrains.",
    },
    laptop: {
      overallRating: 4.5,
      totalRatings: "4,50,000",
      totalReviews: "30,000",
      features: [
        { label: "Performance", rating: 4.8, color: "text-blue-500" },
        { label: "Battery Life", rating: 4.6, color: "text-green-500" },
        { label: "Portability", rating: 4.7, color: "text-yellow-500" },
        { label: "Build Quality", rating: 4.5, color: "text-red-500" },
      ],
      highlight:
        "High-performance laptops designed for professionals and gamers alike.",
    },
  };

  const currentCategory = categoryData[category] || categoryData.phone;

  const ratingColors = [
    "bg-green-500", // 5★
    "bg-green-400", // 4★
    "bg-green-300", // 3★
    "bg-yellow-400", // 2★
    "bg-red-500", // 1★
  ];

  return (
    <div className="p-5 bg-white w-full  rounded-md md:max-w-[1400px] mx-auto">
      <div className="flex flex-wrap justify-between items-center">
        {/* Overall Rating */}
        <div className="md:flex justify-start items-center flex-wrap md:flex-nowrap">
          <div className="text-center md:min-w-[150px] mb-5 md:mb-0">
            <div className="flex justify-center items-center">
              <h3 className="text-4xl font-bold text-blue-600">
                {currentCategory.overallRating}
              </h3>
              <span className="ml-2">
                <FaStar className="w-6 h-6 mt-1 text-yellow-500" />
              </span>
            </div>

            <p className="text-gray-500 text-sm">
              {currentCategory.totalRatings} Ratings <br /> & <br />{" "}
              {currentCategory.totalReviews} Reviews
            </p>
          </div>

          {/* Ratings Breakdown */}
          <div className="flex flex-col gap-3 md:ml-5">
            {[5, 4, 3, 2, 1].map((stars, index) => (
              <div key={stars} className="flex items-center gap-3">
                <span className="w-5 text-sm font-semibold text-gray-600">
                  {stars}★
                </span>
                <div className="w-40 bg-gray-200 h-2 rounded-md">
                  <div
                    className={`${ratingColors[index]} h-2 rounded-md`}
                    style={{ width: `${stars * 10}%` }}
                  ></div>
                </div>
                <span className="text-gray-500 text-sm">{stars * 10000}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Features Ratings */}
        <div className="mt-5 md:mt-0 w-full flex justify-around md:max-w-[700px] md:gap-x-0 gap-x-3 items-start">
          {currentCategory.features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="relative w-14 h-14">
                <svg
                  className={`w-14 h-14 ${feature.color}`}
                  viewBox="0 0 36 36"
                >
                  <path
                    className="text-gray-200"
                    d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  />
                  <path
                    className={feature.color}
                    d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeDasharray={`${(feature.rating / 5) * 100}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex justify-center items-center text-sm font-semibold">
                  {feature.rating}
                </div>
              </div>
              <p className={`mt-2 text-sm ${feature.color}`}>{feature.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Center Highlight Section */}
      {/* <div className="mt-8 p-5 bg-gray-100 rounded-md text-center">
        <h4 className="text-xl font-semibold mb-2 text-green-700">
          What Customers Love
        </h4>
        <p className="text-gray-600 text-sm">{currentCategory.highlight}</p>
      </div> */}
    </div>
  );
};

export default RatingsAndReviews;
