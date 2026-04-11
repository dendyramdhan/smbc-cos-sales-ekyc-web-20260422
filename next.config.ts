import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  poweredByHeader: false,
  transpilePackages: ['@chakra-ui/react'],
  basePath: '/ekyc',
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Content-Security-Policy',
            value: 'frame-ancestors \'self\'',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/ekyc',
        permanent: false,
        basePath: false,
      },
    ];
  },
};

export default nextConfig;
