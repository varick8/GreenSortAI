// filepath: c:\Users\ASUS\source\repos\Senpro\GreenSortAI\frontend\next.config.js
const nextConfig = {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          ...(config.resolve.fallback || {}),
          encoding: false, // Tambahkan fallback untuk encoding
        };
      }
      return config;
    },
  };
  
  module.exports = nextConfig;