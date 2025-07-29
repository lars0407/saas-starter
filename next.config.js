/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for Vercel deployment
  output: 'standalone',
  // Ensure proper handling of client components
  experimental: {
    serverComponentsExternalPackages: [],
  },
};

module.exports = nextConfig; 