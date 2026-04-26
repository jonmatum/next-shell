'use client';

import { ContentContainer, PageHeader } from '@jonmatum/next-shell/layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@jonmatum/next-shell/primitives';
import { useUser } from '@jonmatum/next-shell/auth';

export default function DashboardPage() {
  const user = useUser();

  return (
    <ContentContainer>
      <PageHeader
        title={`Welcome, ${user?.name ?? 'User'}`}
        description="This is your starter dashboard. Customize it to fit your needs."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Getting Started</CardTitle>
            <CardDescription>Add your first feature</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Edit{' '}
              <code className="bg-muted rounded px-1 py-0.5 text-xs">app/(shell)/page.tsx</code> to
              start building your dashboard.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Navigation</CardTitle>
            <CardDescription>Add pages to the sidebar</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Update <code className="bg-muted rounded px-1 py-0.5 text-xs">NAV_CONFIG</code> in the
              shell layout to add new navigation items.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Theme</CardTitle>
            <CardDescription>Light and dark mode built in</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              The app supports light, dark, and system themes out of the box via the{' '}
              <code className="bg-muted rounded px-1 py-0.5 text-xs">AppProviders</code> component.
            </p>
          </CardContent>
        </Card>
      </div>
    </ContentContainer>
  );
}
