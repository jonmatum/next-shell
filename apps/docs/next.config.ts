import type { NextConfig } from 'next';
import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@jonmatum/next-shell'],
};

export default withMDX(config);
