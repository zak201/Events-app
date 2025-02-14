const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'res.cloudinary.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.minimizer = config.optimization.minimizer.map(minimizer => {
        if (minimizer.constructor.name === 'CssMinimizerPlugin') {
          return {
            ...minimizer,
            options: {
              ...minimizer.options,
              minimizerOptions: {
                ...minimizer.options.minimizerOptions,
                preset: ['default', { discardComments: { removeAll: true } }],
              },
            },
          };
        }
        return minimizer;
      });
    }
    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);