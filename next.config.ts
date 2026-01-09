import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // If you are deploying to a user site (username.github.io), remove this basePath.
  // If you are deploying to a project site (username.github.io/vitalrpgov), keep this matching your repo name.
  // basePath: '/vitalrpgov',
};

export default nextConfig;
