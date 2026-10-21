/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  experimental: {
    // import only the icons / animation helpers that are used instead of whole packages
    optimizePackageImports: ['framer-motion', 'react-icons/fi', 'react-icons/fa', 'react-icons/si', 'react-icons/hi', 'react-icons/tb'],
  },
}

module.exports = nextConfig
