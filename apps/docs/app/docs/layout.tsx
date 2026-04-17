import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { source } from '@/app/source';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      githubUrl="https://github.com/jonmatum/next-shell"
      nav={{
        title: <span className="font-semibold">next-shell</span>,
      }}
    >
      {children}
    </DocsLayout>
  );
}
