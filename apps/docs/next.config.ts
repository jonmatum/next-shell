import type { NextConfig } from 'next';
import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@jonmatum/next-shell'],
  ...(isGitHubPages && {
    output: 'export',
    basePath: '/next-shell',
    images: { unoptimized: true },
  }),
};

export default withMDX(config);
