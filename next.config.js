/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: process.env.NEXT_PUBLIC_PROTOCOL ?? "http",
        hostname: process.env.NEXT_PUBLIC_HOSTNAME ?? "localhost",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
