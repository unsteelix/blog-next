/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picola2.unsteelix.keenetic.link',
        // port: '2000',
      },
    ],
  }
}

module.exports = nextConfig
