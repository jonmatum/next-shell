import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { source } from '@/app/source';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      githubUrl="https://github.com/jonmatum/next-shell"
      disableThemeSwitch
      nav={{
        title: (
          <span className="gradient-text" style={{ fontFamily: 'var(--font-terminal), monospace' }}>
            next-shell
          </span>
        ),
      }}
    >
      {children}
    </DocsLayout>
  );
}
