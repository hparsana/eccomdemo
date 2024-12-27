/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**", // Allows all paths under this domain
      },
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com",
        pathname: "**", // Allows all paths under this domain
      },
      {
        protocol: "https",
        hostname: "i.pinimg.com",
        pathname: "**", // Allows all paths under this domain
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
        pathname: "**", // Allows all paths under this domain
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "**", // Allows all paths under this domain
      },
      {
        protocol: "https",
        hostname: "static.nike.com",
        pathname: "**", // Allows all paths under this domain
      },
      {
        protocol: "https",
        hostname: "assets.adidas.com",
        pathname: "**", // Allows all paths under this domain
      },
      {
        protocol: "https",
        hostname: "localhost",
        pathname: "**", // Allows all paths under this domain
      },
      {
        protocol: "https",
        hostname: "fdn2.gsmarena.com",
        pathname: "**", // Allows all paths under this domain
      },
      {
        protocol: "https",
        hostname: "fdn.gsmarena.com",
        pathname: "**", // Allows all paths under this domain
      },
      {
        protocol: "https",
        hostname: "assets.aceternity.com",
        pathname: "**", // Allows all paths under this domain
      },
    ],
  },
};

export default nextConfig;
