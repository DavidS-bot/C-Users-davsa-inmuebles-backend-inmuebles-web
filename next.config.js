/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Durante el build, ignora los errores de ESLint
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Durante el build, ignora los errores de TypeScript
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**',
      },
    ],
  },
}

module.exports = nextConfig