/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@radix-ui/react-icons'],
  turbopack: {
    // Force Next to use this project as the root (avoid picking a parent directory due to other lockfiles)
    root: new URL(".", import.meta.url).pathname,
  },
};

export default nextConfig;
