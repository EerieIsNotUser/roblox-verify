/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push('discord.js');
    return config;
  },
};

export default nextConfig;