/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['raw.githubusercontent.com'],
    },
    webpack: (config) => {
      config.module.rules.push({
        test: /\.node$/,
        use: 'node-loader',
      });
  
      return config;
    },
  }
  
  
export default nextConfig