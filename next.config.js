/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure proper handling of client components
  experimental: {
    serverComponentsExternalPackages: [],
  },
};

module.exports = nextConfig; 