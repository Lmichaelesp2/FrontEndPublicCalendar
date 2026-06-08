/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['noilusnecqyveosmqeyl.supabase.co'],
  },
  async redirects() {
    return [
      {
        source: '/networking-assistant-beta-2026',
        destination: '/networking-assistant',
        permanent: true,
      },
      {
        source: '/networking-assistant-beta-2026/:path*',
        destination: '/networking-assistant/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
