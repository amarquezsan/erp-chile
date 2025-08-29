/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Remover outputFileTracingRoot que está causando problemas
  }
}

module.exports = nextConfig
