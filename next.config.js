module.exports = {
  env: {
    BASE_URL:
      process.env.NODE_ENV === 'production'
        ? process.env.VERCEL_URL
        : 'http://localhost:3000',
  },
  async rewrites() {
    return {
      afterFiles: [
        {
          has: [
            {
              type: 'host',
              value: '(?<host>.*)',
            },
          ],
          source: '/',
          destination: '/hosts/:host',
        },
        {
          has: [
            {
              type: 'host',
              value: '(?<host>.*)',
            },
          ],
          source: '/:slug',
          destination: '/hosts/:host/:slug',
        },
      ],
    }
  },
}
