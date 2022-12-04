/** @type {import('next').NextConfig} */
const nextConfig = {
  exportTrailingSlash: true,
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ['gateway.pinata.cloud','images.unsplash.com']
  }
}

module.exports = nextConfig


