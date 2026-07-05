/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  allowedDevOrigins: [
    '*.run.app',
    '*.google.com',
    '*.googleusercontent.com',
    'localhost:3000',
    '127.0.0.1:3000'
  ]
};

export default nextConfig;
