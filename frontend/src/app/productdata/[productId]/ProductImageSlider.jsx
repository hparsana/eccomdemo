import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function ProductImageSlider({ images }) {
  const settings = {
    dots: true, // Show navigation dots
    infinite: true, // Infinite looping
    speed: 500, // Transition speed
    slidesToShow: 1, // Show one slide at a time
    slidesToScroll: 1, // Scroll one slide at a time
    arrows: false, // Hide navigation arrows for small devices
    autoplay: true, // Enable autoplay
    autoplaySpeed: 3000, // Autoplay interval
  };

  return (
    <div className="lg:hidden block">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="relative w-full h-[300px] md:h-[500px]">
            <Image
              src={image?.url}
              alt={`Product Image ${index + 1}`}
              layout="fill" // Ensures the image fills the container
              objectFit="cover" // Ensures the image covers the container
              className="rounded-lg"
              priority={index === 0} // Prioritize loading the first image
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default ProductImageSlider;
