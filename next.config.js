/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  experimental: {
    nextScriptWorkers: true,
  },
  env: { apiUrl: "http://localhost:8000/api/" },
};

module.exports = nextConfig;
