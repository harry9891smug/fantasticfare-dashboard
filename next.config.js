/** @type {import('next').NextConfig} */
const nextConfig = {
  // images: {
  //   domains: ['localhost'],
  // },
  images: {
    domains: ['localhost','backend.fantasticfare.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'backend.fantasticfare.com',
        pathname: '/uploads/**', // adjust if your path is different
      },
    ],
    
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.module.rules.forEach((rule) => {
        if (rule.test && rule.test.toString().includes('css')) {
          rule.use = rule.use.map((loader) => {
            if (loader.loader?.includes('style-loader')) {
              return { loader: require.resolve('null-loader') }
            }
            return loader
          })
        }
      })
    }
    
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource',
    })

    return config
  },
}

module.exports = nextConfig