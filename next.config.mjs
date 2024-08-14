/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env:{
    CLIENT_ID: process.env.CLIENT_ID,
    MONGODB_URI: process.env.MONGODB_URI
  }
};

export default nextConfig;
