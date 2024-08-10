/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env:{
    CLIENT_ID: process.env.CLIENT_ID
  }
};

export default nextConfig;
