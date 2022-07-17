/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    TWILIO_CHANNEL_ADMIN: process.env.TWILIO_CHANNEL_ADMIN,
  },
}

module.exports = nextConfig
