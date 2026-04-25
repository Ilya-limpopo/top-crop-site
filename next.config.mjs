/** @type {import('next').NextConfig} */
const nextConfig = {
  generateBuildId: async () => 'build-' + Date.now(),
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
};

export default nextConfig;
