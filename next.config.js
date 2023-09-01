/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'media.giphy.com',
      'media0.giphy.com',
      'media1.giphy.com',
      'media2.giphy.com',
      'media3.giphy.com',
      'media4.giphy.com',
      'api.dicebear.com',
      'media.us1.twilio.com',
    ],
  },
  env: {
    GIPHY_API_KEY: process.env.GIPHY_API_KEY,
    TWILIO_CHANNEL_ADMIN: process.env.TWILIO_CHANNEL_ADMIN,
  },
}

module.exports = nextConfig
