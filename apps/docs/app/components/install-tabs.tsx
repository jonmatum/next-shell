'use client';

import { Tab, Tabs } from 'fumadocs-ui/components/tabs';

export function InstallTabs({ packages }: { packages: string }) {
  return (
    <Tabs items={['pnpm', 'npm', 'yarn']}>
      <Tab value="pnpm">
        <pre>
          <code>{`pnpm add ${packages}`}</code>
        </pre>
      </Tab>
      <Tab value="npm">
        <pre>
          <code>{`npm install ${packages}`}</code>
        </pre>
      </Tab>
      <Tab value="yarn">
        <pre>
          <code>{`yarn add ${packages}`}</code>
        </pre>
      </Tab>
    </Tabs>
  );
}
