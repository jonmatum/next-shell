'use client';

import { toast } from 'sonner';
import {
  ContentContainer,
  PageHeader,
  EmptyState,
  LoadingState,
} from '@jonmatum/next-shell/layout';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Progress,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Avatar,
  AvatarFallback,
  Separator,
} from '@jonmatum/next-shell/primitives';
import { useUser, SignedIn } from '@jonmatum/next-shell/auth';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Activity,
  ShoppingCart,
  Plus,
  RefreshCw,
  ArrowUpRight,
} from 'lucide-react';

/* ────────────────────────────────────────────────────────────────────────
 * Data
 * ──────────────────────────────────────────────────────────────────────── */

const stats = [
  {
    label: 'Total Revenue',
    value: '$48,295',
    change: '+12.5%',
    trend: 'up' as const,
    description: 'vs. last month',
    icon: DollarSign,
  },
  {
    label: 'Active Users',
    value: '2,841',
    change: '+4.3%',
    trend: 'up' as const,
    description: 'vs. last month',
    icon: Users,
  },
  {
    label: 'Orders',
    value: '1,023',
    change: '-2.1%',
    trend: 'down' as const,
    description: 'vs. last month',
    icon: ShoppingCart,
  },
  {
    label: 'Conversion Rate',
    value: '3.24%',
    change: '+0.8%',
    trend: 'up' as const,
    description: 'vs. last month',
    icon: Activity,
  },
];

const revenueByChannel = [
  { label: 'Direct Sales', value: 62, amount: '$29,943' },
  { label: 'Affiliate', value: 21, amount: '$10,142' },
  { label: 'Organic Search', value: 11, amount: '$5,312' },
  { label: 'Social Media', value: 6, amount: '$2,898' },
];

const monthlyRevenue = [
  { month: 'Jan', revenue: 18200 },
  { month: 'Feb', revenue: 21400 },
  { month: 'Mar', revenue: 19800 },
  { month: 'Apr', revenue: 24100 },
  { month: 'May', revenue: 28900 },
  { month: 'Jun', revenue: 32400 },
  { month: 'Jul', revenue: 29600 },
  { month: 'Aug', revenue: 35100 },
  { month: 'Sep', revenue: 38700 },
  { month: 'Oct', revenue: 42300 },
  { month: 'Nov', revenue: 45100 },
  { month: 'Dec', revenue: 48295 },
];

const recentActivity = [
  { user: 'Alice Chen', action: 'placed an order', amount: '$249.00', time: '2m ago' },
  { user: 'Bob Smith', action: 'subscribed to Pro', amount: '$29/mo', time: '5m ago' },
  { user: 'Carol Davis', action: 'left a review', amount: null, time: '12m ago' },
  { user: 'Dan Wilson', action: 'upgraded plan', amount: '$99/mo', time: '18m ago' },
  { user: 'Eve Martinez', action: 'placed an order', amount: '$512.00', time: '24m ago' },
];

/* ────────────────────────────────────────────────────────────────────────
 * Page
 * ──────────────────────────────────────────────────────────────────────── */

export default function DashboardPage() {
  const user = useUser();

  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue));

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
          <Card key={stat.label} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                {stat.label}
              </CardTitle>
              <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                <stat.icon className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-foreground text-3xl font-bold tracking-tight">{stat.value}</div>
              <div className="mt-1 flex items-center gap-1 text-xs">
                {stat.trend === 'up' ? (
                  <TrendingUp className="text-primary size-3" />
                ) : (
                  <TrendingDown className="text-destructive size-3" />
                )}
                <span
                  className={
                    stat.trend === 'up'
                      ? 'text-primary font-medium'
                      : 'text-destructive font-medium'
                  }
                >
                  {stat.change}
                </span>
                <span className="text-muted-foreground">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Revenue Overview — bar chart using Progress bars */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-base">Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue for the current year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2" style={{ height: '200px' }}>
              {monthlyRevenue.map((m) => {
                const height = Math.round((m.revenue / maxRevenue) * 100);
                return (
                  <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
                    <span className="text-muted-foreground text-[10px] font-medium tabular-nums">
                      {Math.round(m.revenue / 1000)}k
                    </span>
                    <div className="relative w-full flex-1">
                      <div
                        className="bg-primary/80 hover:bg-primary absolute bottom-0 w-full rounded-t-sm transition-colors"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <span className="text-muted-foreground text-[10px]">{m.month}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Channel */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">Revenue by Channel</CardTitle>
            <CardDescription>Distribution across acquisition channels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueByChannel.map((channel) => (
                <div key={channel.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{channel.label}</span>
                    <span className="text-muted-foreground tabular-nums">{channel.amount}</span>
                  </div>
                  <Progress value={channel.value} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity + States */}
      <Tabs defaultValue="activity" className="w-full">
        <TabsList>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="states">State Demos</TabsTrigger>
          <TabsTrigger value="toasts">Toast Demos</TabsTrigger>
        </TabsList>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Activity</CardTitle>
              <CardDescription>Latest transactions and user actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {recentActivity.map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center gap-3 py-3">
                      <Avatar className="size-8">
                        <AvatarFallback className="text-xs">
                          {item.user
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-0.5">
                        <p className="text-sm">
                          <span className="font-medium">{item.user}</span>{' '}
                          <span className="text-muted-foreground">{item.action}</span>
                        </p>
                        <p className="text-muted-foreground text-xs">{item.time}</p>
                      </div>
                      {item.amount && (
                        <Badge variant="secondary" className="tabular-nums">
                          {item.amount}
                        </Badge>
                      )}
                      <Button variant="ghost" size="icon" className="size-7">
                        <ArrowUpRight className="size-3.5" />
                      </Button>
                    </div>
                    {i < recentActivity.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="states">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Loading State</CardTitle>
              </CardHeader>
              <CardContent>
                <LoadingState description="Fetching analytics..." />
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
        </TabsContent>

        <TabsContent value="toasts">
          <SignedIn>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Toast Variants</CardTitle>
                <CardDescription>
                  Click each button to see different toast styles powered by Sonner.
                </CardDescription>
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
                  onClick={() => toast.warning('This is a warning.')}
                >
                  Warning
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.info('Here is some information.')}
                >
                  Info
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toast.promise(new Promise((r) => setTimeout(r, 2000)), {
                      loading: 'Processing...',
                      success: 'Done!',
                      error: 'Failed.',
                    });
                  }}
                >
                  Promise
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    toast('Event created', {
                      description: 'Monday, January 3rd at 6:00 PM',
                      action: {
                        label: 'Undo',
                        onClick: () => toast.info('Undone!'),
                      },
                    })
                  }
                >
                  With Action
                </Button>
              </CardContent>
            </Card>
          </SignedIn>
        </TabsContent>
      </Tabs>
    </ContentContainer>
  );
}
