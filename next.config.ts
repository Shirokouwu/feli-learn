import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
      }, {
        hostname: "res.cloudinary.com",
      }, {
        hostname: "images.pexels.com"
      }, {
        hostname: "static.inaturalist.org"
      }, {
        hostname: "www.tzwcadopt.ca"
      }, {
        hostname: "lh3.googleusercontent.com"
      }, {
        hostname: "avatars.githubusercontent.com"
      }
    ]
  },
};

export default nextConfig;
