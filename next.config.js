const checkEnvVariables = require("./check-env-variables")
const path = require("path")

checkEnvVariables()

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // cacheComponents: true,
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    qualities: [25, 50, 75, 100],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa.irinacloud.co",
      },
      {
        protocol: "https",
        hostname: "http2.mlstatic.com",
      },
      {
        protocol: "https",
        hostname: "mercadopago.com",
      },
      {
        protocol: "https",
        hostname: "cool.irinacloud.co",
      },
      {
        protocol: "https",
        hostname: "coolback.tradicional-coffee.shop",
      },
    ],
  },
}

module.exports = nextConfig
