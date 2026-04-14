/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      resolveAlias: {
        'discord.js': { browser: './empty-module.js' },
      },
    },
  },
};

export default nextConfig;