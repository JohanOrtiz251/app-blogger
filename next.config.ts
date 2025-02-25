import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
     // Deshabilita ESLint en la compilación
  },
};

export default nextConfig;
