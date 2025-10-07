/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // <- ignores ESLint during production build
  },
};

module.exports = nextConfig;
