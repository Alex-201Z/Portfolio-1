
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'x-custom-header',
            value: 'genkit',
          },
        ],
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.steamstatic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.steampowered.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ddragon.leagueoflegends.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
