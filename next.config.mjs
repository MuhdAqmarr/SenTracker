import withPWA from 'next-pwa'

const nextConfig = {
  reactStrictMode: true,
}

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development for faster reloads
  buildExcludes: [/middleware-manifest\.json$/],
})

export default pwaConfig(nextConfig)
