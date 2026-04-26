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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
} from '@jonmatum/next-shell/primitives';
import { useUser, SignedIn } from '@jonmatum/next-shell/auth';

/* Showcases the @jonmatum/next-shell/formatters subpath — locale-aware,
   pure formatting functions built on Intl. */
import {
  formatCurrency,
  formatRelativeTime,
  formatPercent,
  formatNumber,
} from '@jonmatum/next-shell/formatters';

/* Showcases the @jonmatum/next-shell/hooks subpath — client-side utility hooks. */
import {
  useCopyToClipboard,
  useDisclosure,
  useHotkey,
  useLocalStorage,
} from '@jonmatum/next-shell/hooks';

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
  Copy,
  Check,
  Keyboard,
  Terminal,
  LayoutGrid,
  LayoutList,
} from 'lucide-react';

/* ────────────────────────────────────────────────────────────────────────
 * Mock data — raw values fed through library formatters at render time
 * ──────────────────────────────────────────────────────────────────────── */

const stats = [
  {
    label: 'Total Revenue',
    rawValue: 48295,
    change: 0.125,
    trend: 'up' as const,
    description: 'vs. last month',
    icon: DollarSign,
    format: 'currency' as const,
  },
  {
    label: 'Active Users',
    rawValue: 2841,
    change: 0.043,
    trend: 'up' as const,
    description: 'vs. last month',
    icon: Users,
    format: 'number' as const,
  },
  {
    label: 'Orders',
    rawValue: 1023,
    change: -0.021,
    trend: 'down' as const,
    description: 'vs. last month',
    icon: ShoppingCart,
    format: 'number' as const,
  },
  {
    label: 'Conversion Rate',
    rawValue: 0.0324,
    change: 0.008,
    trend: 'up' as const,
    description: 'vs. last month',
    icon: Activity,
    format: 'percent' as const,
  },
];

const revenueByChannel = [
  { label: 'Direct Sales', value: 62, rawAmount: 29943 },
  { label: 'Affiliate', value: 21, rawAmount: 10142 },
  { label: 'Organic Search', value: 11, rawAmount: 5312 },
  { label: 'Social Media', value: 6, rawAmount: 2898 },
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
  {
    id: 'act-alice-order',
    user: 'Alice Chen',
    action: 'placed an order',
    rawAmount: 249.0,
    timeOffset: 2 * 60 * 1000,
  },
  {
    id: 'act-bob-subscribe',
    user: 'Bob Smith',
    action: 'subscribed to Pro',
    rawAmount: null,
    subscription: '$29/mo',
    timeOffset: 5 * 60 * 1000,
  },
  {
    id: 'act-carol-review',
    user: 'Carol Davis',
    action: 'left a review',
    rawAmount: null,
    timeOffset: 12 * 60 * 1000,
  },
  {
    id: 'act-dan-upgrade',
    user: 'Dan Wilson',
    action: 'upgraded plan',
    rawAmount: null,
    subscription: '$99/mo',
    timeOffset: 18 * 60 * 1000,
  },
  {
    id: 'act-eve-order',
    user: 'Eve Martinez',
    action: 'placed an order',
    rawAmount: 512.0,
    timeOffset: 24 * 60 * 1000,
  },
];

/** Demo API key for the copy-to-clipboard hook showcase. */
const DEMO_API_KEY = 'nxsh_live_k8f2a9Qx7mPwR3jL5nBvY6dH';

/* ────────────────────────────────────────────────────────────────────────
 * Helpers
 * ──────────────────────────────────────────────────────────────────────── */

function formatStatValue(rawValue: number, format: 'currency' | 'number' | 'percent'): string {
  switch (format) {
    case 'currency':
      return formatCurrency(rawValue, 'USD');
    case 'percent':
      return formatPercent(rawValue, { maximumFractionDigits: 2 });
    case 'number':
      return formatNumber(rawValue);
  }
}

function formatStatChange(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return sign + formatPercent(change, { maximumFractionDigits: 1 });
}

/* ────────────────────────────────────────────────────────────────────────
 * Page
 * ──────────────────────────────────────────────────────────────────────── */

export default function DashboardPage() {
  const user = useUser();
  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue));

  /* ── Hooks demos ────────────────────────────────────────────────────── */
  const { isCopied, copy } = useCopyToClipboard();
  const settingsDialog = useDisclosure();
  const [dashboardLayout, setDashboardLayout] = useLocalStorage<'grid' | 'list'>(
    'dashboard-layout',
    'grid',
  );

  // Ctrl+K / Cmd+K opens the settings dialog
  useHotkey('k', () => settingsDialog.open(), { meta: true });

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

      {/* Stats Grid — values generated through formatters */}
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
              <div className="text-foreground text-3xl font-bold tracking-tight">
                {formatStatValue(stat.rawValue, stat.format)}
              </div>
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
                  {formatStatChange(stat.change)}
                </span>
                <span className="text-muted-foreground">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Revenue Overview — bar chart using div heights */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-base">Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue for the current year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[200px] items-end gap-2">
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

        {/* Revenue by Channel — amounts generated through formatCurrency */}
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
                    <span className="text-muted-foreground tabular-nums">
                      {formatCurrency(channel.rawAmount, 'USD')}
                    </span>
                  </div>
                  <Progress value={channel.value} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Developer Tools — hooks demo section */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Copy to Clipboard — useCopyToClipboard */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Terminal className="size-4" />
              API Key
            </CardTitle>
            <CardDescription>
              Copy your API key using <code className="text-xs">useCopyToClipboard</code>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Input readOnly value={DEMO_API_KEY} className="font-mono text-xs" />
              <Button
                variant="outline"
                size="icon"
                className="shrink-0"
                onClick={() => copy(DEMO_API_KEY)}
              >
                {isCopied ? <Check className="text-primary size-4" /> : <Copy className="size-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Keyboard Shortcut — useHotkey + useDisclosure */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Keyboard className="size-4" />
              Quick Settings
            </CardTitle>
            <CardDescription>
              Press{' '}
              <kbd className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 font-mono text-xs">
                {'⌘'}K
              </kbd>{' '}
              or click below &mdash; powered by <code className="text-xs">useHotkey</code> +{' '}
              <code className="text-xs">useDisclosure</code>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={settingsDialog.isOpen} onOpenChange={settingsDialog.onOpenChange}>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-between"
                onClick={settingsDialog.open}
              >
                Open Settings
                <kbd className="bg-muted text-muted-foreground ml-2 rounded px-1.5 py-0.5 font-mono text-xs">
                  {'⌘'}K
                </kbd>
              </Button>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Quick Settings</DialogTitle>
                  <DialogDescription>
                    This dialog is controlled by <code>useDisclosure</code> and opened via{' '}
                    <code>useHotkey</code> ({'⌘'}K).
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Dashboard Layout</span>
                    <div className="flex gap-1">
                      <Button
                        variant={dashboardLayout === 'grid' ? 'default' : 'outline'}
                        size="icon"
                        className="size-8"
                        onClick={() => setDashboardLayout('grid')}
                      >
                        <LayoutGrid className="size-4" />
                      </Button>
                      <Button
                        variant={dashboardLayout === 'list' ? 'default' : 'outline'}
                        size="icon"
                        className="size-8"
                        onClick={() => setDashboardLayout('list')}
                      >
                        <LayoutList className="size-4" />
                      </Button>
                    </div>
                  </div>
                  <Separator />
                  <p className="text-muted-foreground text-xs">
                    Layout preference is persisted to <code>localStorage</code> via{' '}
                    <code>useLocalStorage</code>. Current:{' '}
                    <Badge variant="secondary" className="ml-1">
                      {dashboardLayout}
                    </Badge>
                  </p>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={settingsDialog.close}>
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Persisted Preference — useLocalStorage */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              {dashboardLayout === 'grid' ? (
                <LayoutGrid className="size-4" />
              ) : (
                <LayoutList className="size-4" />
              )}
              Layout Preference
            </CardTitle>
            <CardDescription>
              Persisted via <code className="text-xs">useLocalStorage</code>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                variant={dashboardLayout === 'grid' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => setDashboardLayout('grid')}
              >
                <LayoutGrid className="size-4" />
                Grid
              </Button>
              <Button
                variant={dashboardLayout === 'list' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => setDashboardLayout('list')}
              >
                <LayoutList className="size-4" />
                List
              </Button>
            </div>
            <p className="text-muted-foreground mt-2 text-xs">
              Survives page reloads. Try switching and refreshing.
            </p>
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
                  <div key={item.id}>
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
                        <p className="text-muted-foreground text-xs">
                          {formatRelativeTime(new Date(Date.now() - item.timeOffset))}
                        </p>
                      </div>
                      {item.rawAmount ? (
                        <Badge variant="secondary" className="tabular-nums">
                          {formatCurrency(item.rawAmount, 'USD')}
                        </Badge>
                      ) : item.subscription ? (
                        <Badge variant="secondary" className="tabular-nums">
                          {item.subscription}
                        </Badge>
                      ) : null}
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
