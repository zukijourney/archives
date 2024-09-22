/** @type {import('next').NextConfig} */
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['raw.githubusercontent.com'],
    },
    env: {
      GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    },
  }
  
  
  
export default nextConfig