import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    // domains: [
    //   'media.giphy.com',
    //   'media0.giphy.com',
    //   'media1.giphy.com',
    //   'media2.giphy.com',
    //   'media3.giphy.com',
    //   'media4.giphy.com',
    //   'api.dicebear.com',
    //   'media.us1.twilio.com',
    // ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
