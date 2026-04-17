'use client';

import { toast } from 'sonner';
import {
  ContentContainer,
  PageHeader,
  EmptyState,
  LoadingState,
} from '@jonmatum/next-shell/layout';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@jonmatum/next-shell/primitives';
import { useUser, SignedIn } from '@jonmatum/next-shell/auth';
import { TrendingUp, Users, DollarSign, Activity, Plus, RefreshCw } from 'lucide-react';

const stats = [
  { label: 'Total Revenue', value: '$48,295', change: '+12%', icon: DollarSign },
  { label: 'Active Users', value: '2,841', change: '+4%', icon: Users },
  { label: 'Conversions', value: '1,023', change: '+8%', icon: TrendingUp },
  { label: 'System Health', value: '99.9%', change: '0%', icon: Activity },
];

export default function DashboardPage() {
  const user = useUser();

  return (
    <ContentContainer>
      <PageHeader
        title={`Welcome back, ${user?.name ?? 'Demo User'}`}
        description="Here's what's happening with your project today."
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info('Refreshed!', { description: 'Data is up to date.' })}
            >
              <RefreshCw className="size-4" />
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={() =>
                toast.success('Created!', { description: 'New item added successfully.' })
              }
            >
              <Plus className="size-4" />
              New Item
            </Button>
          </div>
        }
      />

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="text-muted-foreground size-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-muted-foreground text-xs">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status State Demo */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Loading State</CardTitle>
          </CardHeader>
          <CardContent>
            <LoadingState description="Fetching analytics…" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Empty State</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              title="No recent activity"
              description="Activity will appear here once events are recorded."
              action={
                <Button variant="outline" size="sm">
                  <Plus className="size-4" />
                  Add first item
                </Button>
              }
            />
          </CardContent>
        </Card>
      </div>

      {/* Toast Demo */}
      <SignedIn>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Toast Demos</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.success('Success toast!')}>
              Success
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.error('Something went wrong.')}
            >
              Error
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                toast.promise(new Promise((r) => setTimeout(r, 2000)), {
                  loading: 'Processing…',
                  success: 'Done!',
                  error: 'Failed.',
                });
              }}
            >
              Promise
            </Button>
          </CardContent>
        </Card>
      </SignedIn>
    </ContentContainer>
  );
}
