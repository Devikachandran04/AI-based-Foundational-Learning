/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: false, // critical for WASM / Bolt
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
};

module.exports = nextConfig;
