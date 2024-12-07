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
    ],
  },
};

export default nextConfig;
