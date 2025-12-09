import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
      }, {
        hostname: "res.cloudinary.com",
      }, {
        hostname: "images.pexels.com"
      }, {
        hostname: "static.inaturalist.org"
      }, {
        hostname: "www.tzwcadopt.ca"
      }, {
        hostname: "lh3.googleusercontent.com"
      }, {
        hostname: "avatars.githubusercontent.com"
      }, {
        hostname: "sxowqvkanlihnrsijcsm.supabase.co"
      }, {
        hostname: "upload.wikimedia.org"
      }
    ]
  },
  // Turbopack configuration (dipindah dari experimental.turbo)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb'
    },
    // Package import optimizations untuk Turbopack
    optimizePackageImports: [
      '@radix-ui/react-accordion',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-label',
      '@radix-ui/react-navigation-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-progress',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-slider',
      '@radix-ui/react-slot',
      '@radix-ui/react-switch',
      '@radix-ui/react-tabs',
      '@radix-ui/react-tooltip',
      'lucide-react',
      'recharts',
      'framer-motion',
      'date-fns'
    ]
  },
  // Disable source maps in development untuk performa
  productionBrowserSourceMaps: false
};

export default nextConfig;
