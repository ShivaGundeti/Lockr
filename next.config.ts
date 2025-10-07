/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // keep React strict mode for safety
  swcMinify: true,       // faster build minification
  eslint: {
    ignoreDuringBuilds: true, // completely ignore ESLint during builds
  },
  images: {
    domains: ["res.cloudinary.com"], // if you use Cloudinary for uploads
  },
  experimental: {
    appDir: true, // if you are using Next.js App Router
  },
};

module.exports = nextConfig;
