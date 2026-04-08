/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  eslint: {
    dirs: ['src', 'test']
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)', // all routes
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'Content-Security-Policy',
            value: 'frame-ancestors \'self\''
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
