const productData = {
  statusCode: 200,
  message: "Success",
  success: true,
  data: {
    products: [
      // Product 1: Footwear
      {
        _id: "1",
        name: "Nike Air Zoom Pegasus 39",
        description:
          "Top-quality running shoes with a sleek and lightweight design.",
        price: 7999,
        originalPrice: 9999,
        discount: "20% off",
        discountValue: 2000,
        category: "Footwear",
        brand: "Nike",
        stock: 8,
        size: ["7", "8", "9", "10"],
        color: ["Black", "White", "Blue"],
        images: [
          {
            url: "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg",
            alt: "Nike Pegasus Side View",
            _id: "img1-nike",
          },
          {
            url: "https://images.pexels.com/photos/1867794/pexels-photo-1867794.jpeg",
            alt: "Nike Pegasus Top View",
            _id: "img2-nike",
          },
          {
            url: "https://images.pexels.com/photos/442781/pexels-photo-442781.jpeg",
            alt: "Nike Pegasus Lifestyle",
            _id: "img3-nike",
          },
        ],
        rating: 4.5,
        isFeatured: true,
        reviews: [
          {
            reviewer: "John Doe",
            rating: 5,
            comment: "Perfect shoes for daily running!",
            date: "2024-06-01",
          },
          {
            reviewer: "Jane Smith",
            rating: 4,
            comment: "Comfortable but needs better grip.",
            date: "2024-06-05",
          },
          {
            reviewer: "Sam Wilson",
            rating: 4.5,
            comment: "Great design and fit.",
            date: "2024-06-10",
          },
        ],
      },
      // Product 2: Electronics
      {
        _id: "2",
        name: "Sony WH-1000XM4 Headphones",
        description:
          "High-quality noise-canceling wireless headphones with immersive sound.",
        price: 19999,
        originalPrice: 24999,
        discount: "20% off",
        discountValue: 5000,
        category: "Electronics",
        brand: "Sony",
        stock: 6,
        color: ["Black", "Silver"],
        warranty: "1 Year",
        batteryLife: "30 Hours",
        features: ["Noise Cancellation", "Wireless", "Long Battery Life"],
        images: [
          {
            url: "https://images.pexels.com/photos/3771836/pexels-photo-3771836.jpeg",
            alt: "Sony Headphones",
            _id: "img1-sony",
          },
          {
            url: "https://images.pexels.com/photos/3797981/pexels-photo-3797981.jpeg",
            alt: "Sony Headphones Front",
            _id: "img2-sony",
          },
          {
            url: "https://images.pexels.com/photos/4202907/pexels-photo-4202907.jpeg",
            alt: "Sony Headphones Lifestyle",
            _id: "img3-sony",
          },
        ],
        rating: 4.9,
        isFeatured: true,
        reviews: [
          {
            reviewer: "Alice Brown",
            rating: 5,
            comment: "Incredible sound and noise cancellation!",
            date: "2024-05-25",
          },
          {
            reviewer: "Bob Martin",
            rating: 4.8,
            comment: "Battery lasts as advertised.",
            date: "2024-06-01",
          },
          {
            reviewer: "Chris Lee",
            rating: 4.5,
            comment: "Comfortable for long hours.",
            date: "2024-06-03",
          },
        ],
      },
      // Product 3: Wearables
      {
        _id: "3",
        name: "Samsung Galaxy Watch 5",
        description:
          "Smartwatch with advanced health tracking and sleek design.",
        price: 14999,
        originalPrice: 19999,
        discount: "25% off",
        discountValue: 5000,
        category: "Wearables",
        brand: "Samsung",
        stock: 10,
        color: ["Black", "Silver"],
        batteryLife: "40 Hours",
        warranty: "1 Year",
        features: ["Heart Rate Monitor", "GPS", "Sleep Tracking"],
        images: [
          {
            url: "https://images.pexels.com/photos/416404/pexels-photo-416404.jpeg",
            alt: "Galaxy Watch Front",
            _id: "img1-watch",
          },
          {
            url: "https://images.pexels.com/photos/442780/pexels-photo-442780.jpeg",
            alt: "Galaxy Watch Back",
            _id: "img2-watch",
          },
          {
            url: "https://images.pexels.com/photos/164345/pexels-photo-164345.jpeg",
            alt: "Galaxy Watch Lifestyle",
            _id: "img3-watch",
          },
        ],
        rating: 4.7,
        isFeatured: false,
        reviews: [
          {
            reviewer: "David Cooper",
            rating: 5,
            comment: "Great health features and sleek design!",
            date: "2024-06-07",
          },
          {
            reviewer: "Ella Watson",
            rating: 4.5,
            comment: "Battery life is excellent.",
            date: "2024-06-10",
          },
          {
            reviewer: "Frank Smith",
            rating: 4.7,
            comment: "Very accurate health tracking.",
            date: "2024-06-15",
          },
        ],
      },
      // Product 4: Cameras
      {
        _id: "4",
        name: "Canon EOS R6 Camera",
        description: "Full-frame mirrorless camera with 4K video recording.",
        price: 199999,
        originalPrice: 229999,
        discount: "13% off",
        discountValue: 30000,
        category: "Cameras",
        brand: "Canon",
        stock: 4,
        color: ["Black"],
        warranty: "2 Years",
        resolution: "20.1 MP",
        features: ["4K Video Recording", "Fast Autofocus", "WiFi Enabled"],
        images: [
          {
            url: "https://images.pexels.com/photos/177815/pexels-photo-177815.jpeg",
            alt: "Canon EOS R6",
            _id: "img1-canon",
          },
          {
            url: "https://images.pexels.com/photos/212237/pexels-photo-212237.jpeg",
            alt: "Canon Camera View",
            _id: "img2-canon",
          },
          {
            url: "https://images.pexels.com/photos/212332/pexels-photo-212332.jpeg",
            alt: "Canon Camera Lifestyle",
            _id: "img3-canon",
          },
        ],
        rating: 5.0,
        isFeatured: true,
        reviews: [
          {
            reviewer: "Grace Hall",
            rating: 5,
            comment: "The best camera for professionals!",
            date: "2024-05-15",
          },
          {
            reviewer: "Henry Taylor",
            rating: 4.9,
            comment: "Fantastic video recording quality.",
            date: "2024-06-05",
          },
          {
            reviewer: "Ivy White",
            rating: 5,
            comment: "Autofocus is super fast!",
            date: "2024-06-12",
          },
        ],
      },
      // Product 5: Laptops
      {
        _id: "5",
        name: "Apple MacBook Pro M1",
        description:
          "High-performance laptop with M1 chip and stunning Retina display.",
        price: 99999,
        originalPrice: 129999,
        discount: "23% off",
        discountValue: 30000,
        category: "Electronics",
        brand: "Apple",
        stock: 3,
        color: ["Silver", "Space Gray"],
        processor: "Apple M1",
        ram: "16GB",
        storage: "512GB SSD",
        warranty: "1 Year",
        images: [
          {
            url: "https://images.pexels.com/photos/18105/pexels-photo.jpg",
            alt: "MacBook Pro Front",
            _id: "img1-macbook",
          },
          {
            url: "https://images.pexels.com/photos/392018/pexels-photo-392018.jpeg",
            alt: "MacBook Pro Side View",
            _id: "img2-macbook",
          },
          {
            url: "https://images.pexels.com/photos/1128215/pexels-photo-1128215.jpeg",
            alt: "MacBook Pro Open",
            _id: "img3-macbook",
          },
        ],
        rating: 5.0,
        isFeatured: true,
        reviews: [
          {
            reviewer: "Jack Moore",
            rating: 5,
            comment: "Blazing fast performance!",
            date: "2024-06-01",
          },
          {
            reviewer: "Katie Brown",
            rating: 4.8,
            comment: "Battery life is incredible.",
            date: "2024-06-10",
          },
          {
            reviewer: "Liam Carter",
            rating: 5,
            comment: "Perfect for design and development work.",
            date: "2024-06-15",
          },
        ],
      },
      // Product 6: Footwear
      {
        _id: "6",
        name: "Puma RS-X Sneakers",
        description:
          "Retro-inspired sneakers with bold color blocking and modern comfort.",
        price: 6999,
        originalPrice: 8999,
        discount: "22% off",
        discountValue: 2000,
        category: "Footwear",
        brand: "Puma",
        stock: 10,
        size: ["7", "8", "9", "10"],
        color: ["Red", "Black", "White"],
        images: [
          {
            url: "https://images.pexels.com/photos/631044/pexels-photo-631044.jpeg",
            alt: "Puma RS-X Side View",
            _id: "img1-puma",
          },
          {
            url: "https://images.pexels.com/photos/4794524/pexels-photo-4794524.jpeg",
            alt: "Puma RS-X Top View",
            _id: "img2-puma",
          },
          {
            url: "https://images.pexels.com/photos/1619648/pexels-photo-1619648.jpeg",
            alt: "Puma RS-X Lifestyle",
            _id: "img3-puma",
          },
        ],
        rating: 4.4,
        isFeatured: false,
        reviews: [
          {
            reviewer: "Tom Hardy",
            rating: 5,
            comment: "Great shoes for casual wear!",
            date: "2024-06-01",
          },
          {
            reviewer: "Lucy Hale",
            rating: 4.2,
            comment: "Comfortable but slightly heavy.",
            date: "2024-06-03",
          },
          {
            reviewer: "Mark Dean",
            rating: 4.5,
            comment: "Love the retro design!",
            date: "2024-06-06",
          },
        ],
      },
      // Product 7: Electronics
      {
        _id: "7",
        name: "Bose QuietComfort 45",
        description:
          "Premium noise-canceling headphones with exceptional audio clarity.",
        price: 25999,
        originalPrice: 29999,
        discount: "13% off",
        discountValue: 4000,
        category: "Electronics",
        brand: "Bose",
        stock: 5,
        color: ["Black", "White"],
        warranty: "1 Year",
        batteryLife: "24 Hours",
        features: [
          "Noise Cancellation",
          "Bluetooth Connectivity",
          "Comfortable Fit",
        ],
        images: [
          {
            url: "https://images.pexels.com/photos/6461398/pexels-photo-6461398.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            alt: "Bose Headphones Front",
            _id: "img1-bose",
          },
          {
            url: "https://images.pexels.com/photos/376131/pexels-photo-376131.jpeg",
            alt: "Bose Headphones Side View",
            _id: "img2-bose",
          },
          {
            url: "https://images.pexels.com/photos/423614/pexels-photo-423614.jpeg",
            alt: "Bose Headphones Lifestyle",
            _id: "img3-bose",
          },
        ],
        rating: 4.8,
        isFeatured: true,
        reviews: [
          {
            reviewer: "Anna White",
            rating: 5,
            comment: "Top-notch sound quality and noise cancellation.",
            date: "2024-06-02",
          },
          {
            reviewer: "Jack Roberts",
            rating: 4.7,
            comment: "Battery lasts long, very comfortable.",
            date: "2024-06-05",
          },
          {
            reviewer: "Laura Smith",
            rating: 4.5,
            comment: "Expensive but worth the price.",
            date: "2024-06-08",
          },
        ],
      },
      // Product 8: Wearables
      {
        _id: "8",
        name: "Fitbit Charge 5",
        description:
          "Fitness tracker with built-in GPS and advanced health metrics.",
        price: 11999,
        originalPrice: 14999,
        discount: "20% off",
        discountValue: 3000,
        category: "Wearables",
        brand: "Fitbit",
        stock: 12,
        color: ["Black", "Blue", "Gray"],
        batteryLife: "7 Days",
        warranty: "1 Year",
        features: ["Heart Rate Monitor", "Sleep Analysis", "Built-in GPS"],
        images: [
          {
            url: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            alt: "Fitbit Charge Front",
            _id: "img1-fitbit",
          },
          {
            url: "https://images.pexels.com/photos/374692/pexels-photo-374692.jpeg",
            alt: "Fitbit Charge Side View",
            _id: "img2-fitbit",
          },
          {
            url: "https://images.pexels.com/photos/437042/pexels-photo-437042.jpeg",
            alt: "Fitbit Charge Lifestyle",
            _id: "img3-fitbit",
          },
        ],
        rating: 4.6,
        isFeatured: false,
        reviews: [
          {
            reviewer: "Ryan Miller",
            rating: 5,
            comment: "Perfect for fitness tracking!",
            date: "2024-06-02",
          },
          {
            reviewer: "Sophie Adams",
            rating: 4.5,
            comment: "The GPS is very accurate.",
            date: "2024-06-04",
          },
          {
            reviewer: "Ethan Clark",
            rating: 4.2,
            comment: "Battery life is impressive.",
            date: "2024-06-07",
          },
        ],
      },
      // Product 9: Cameras
      {
        _id: "9",
        name: "Nikon Z6 II",
        description:
          "Versatile full-frame mirrorless camera with dual card slots.",
        price: 179999,
        originalPrice: 199999,
        discount: "10% off",
        discountValue: 20000,
        category: "Cameras",
        brand: "Nikon",
        stock: 6,
        color: ["Black"],
        warranty: "2 Years",
        resolution: "24.5 MP",
        features: ["4K Video Recording", "Dual Card Slots", "Fast Autofocus"],
        images: [
          {
            url: "https://images.pexels.com/photos/370937/pexels-photo-370937.jpeg",
            alt: "Nikon Z6 II Front",
            _id: "img1-nikon",
          },
          {
            url: "https://images.pexels.com/photos/1222058/pexels-photo-1222058.jpeg",
            alt: "Nikon Z6 II Side",
            _id: "img2-nikon",
          },
          {
            url: "https://images.pexels.com/photos/1222059/pexels-photo-1222059.jpeg",
            alt: "Nikon Z6 II Usage",
            _id: "img3-nikon",
          },
        ],
        rating: 4.9,
        isFeatured: true,
        reviews: [
          {
            reviewer: "Olivia Green",
            rating: 5,
            comment: "Outstanding image quality!",
            date: "2024-06-03",
          },
          {
            reviewer: "Daniel King",
            rating: 4.8,
            comment: "Great for professional photography.",
            date: "2024-06-06",
          },
          {
            reviewer: "Sophia Bell",
            rating: 5,
            comment: "Autofocus works perfectly.",
            date: "2024-06-10",
          },
        ],
      },
      // Product 10: Home Appliances
      {
        _id: "10",
        name: "Dyson V11 Vacuum Cleaner",
        description:
          "Powerful cordless vacuum cleaner with intelligent suction control.",
        price: 39999,
        originalPrice: 45999,
        discount: "13% off",
        discountValue: 6000,
        category: "Home Appliances",
        brand: "Dyson",
        stock: 8,
        color: ["Purple", "Blue"],
        warranty: "2 Years",
        features: ["Cordless", "High Suction Power", "Long Battery Life"],
        images: [
          {
            url: "https://images.pexels.com/photos/4008333/pexels-photo-4008333.jpeg",
            alt: "Dyson V11 Front",
            _id: "img1-dyson",
          },
          {
            url: "https://images.pexels.com/photos/1630867/pexels-photo-1630867.jpeg",
            alt: "Dyson V11 Side View",
            _id: "img2-dyson",
          },
          {
            url: "https://images.pexels.com/photos/322409/pexels-photo-322409.jpeg",
            alt: "Dyson V11 Usage",
            _id: "img3-dyson",
          },
        ],
        rating: 4.8,
        isFeatured: true,
        reviews: [
          {
            reviewer: "Peter Williams",
            rating: 5,
            comment: "Cleans perfectly and easy to use.",
            date: "2024-06-04",
          },
          {
            reviewer: "Emily Davis",
            rating: 4.7,
            comment: "Battery lasts long, worth the price.",
            date: "2024-06-06",
          },
          {
            reviewer: "Alex Johnson",
            rating: 4.8,
            comment: "Best cordless vacuum I've used!",
            date: "2024-06-08",
          },
        ],
      },
    ],
    totalProducts: 10,
    totalPages: 2,
    currentPage: 2,
    facets: {
      categories: [
        "Footwear",
        "Electronics",
        "Wearables",
        "Cameras",
        "Home Appliances",
      ],
      brands: ["Nike", "Sony", "Puma", "Fitbit", "Nikon", "Dyson", "Bose"],
      priceRange: { min: 6999, max: 179999 },
    },
  },
};

export default productData;
