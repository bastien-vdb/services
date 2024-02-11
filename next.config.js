/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: process.env.PROTOCOL ?? "http",
        hostname: process.env.HOSTNAME ?? "localhost",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
