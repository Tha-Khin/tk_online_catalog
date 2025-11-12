import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['http://192.168.1.103', 'http://localhost', 'http://127.0.0.1'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        // The ** wildcard means it allows any path after the hostname,
        pathname: '/**', 
      },
    ],
  },
};

export default nextConfig;
