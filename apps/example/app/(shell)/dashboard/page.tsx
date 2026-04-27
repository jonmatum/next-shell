'use client';

import { toast } from 'sonner';
import { ContentContainer, PageHeader } from '@jonmatum/next-shell/layout';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Progress,
  Avatar,
  AvatarFallback,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@jonmatum/next-shell/primitives';

import {
  formatCurrency,
  formatRelativeTime,
  formatPercent,
  formatNumber,
} from '@jonmatum/next-shell/formatters';

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
  Copy,
  Check,
  Keyboard,
  Terminal,
  LayoutGrid,
  LayoutList,
  FileText,
  MessageSquare,
  CreditCard,
  Star,
  UserPlus,
  ShieldCheck,
} from 'lucide-react';

/* ────────────────────────────────────────────────────────────────────────
 * Mock data — raw values fed through library formatters at render time
 * ──────────────────────────────────────────────────────────────────────── */

const STATS = [
  {
    id: 'stat-revenue',
    label: 'Total Revenue',
    rawValue: 48295,
    change: 0.125,
    trend: 'up' as const,
    progress: 78,
    description: 'vs. last month',
    icon: DollarSign,
    format: 'currency' as const,
  },
  {
    id: 'stat-users',
    label: 'Active Users',
    rawValue: 2841,
    change: 0.043,
    trend: 'up' as const,
    progress: 65,
    description: 'vs. last month',
    icon: Users,
    format: 'number' as const,
  },
  {
    id: 'stat-orders',
    label: 'Orders',
    rawValue: 1023,
    change: -0.021,
    trend: 'down' as const,
    progress: 42,
    description: 'vs. last month',
    icon: ShoppingCart,
    format: 'number' as const,
  },
  {
    id: 'stat-conversion',
    label: 'Conversion Rate',
    rawValue: 0.0324,
    change: 0.008,
    trend: 'up' as const,
    progress: 54,
    description: 'vs. last month',
    icon: Activity,
    format: 'percent' as const,
  },
];

const WEEKLY_REVENUE = [
  { day: 'Mon', value: 4200 },
  { day: 'Tue', value: 5800 },
  { day: 'Wed', value: 3900 },
  { day: 'Thu', value: 6700 },
  { day: 'Fri', value: 7400 },
];

const RECENT_ACTIVITY = [
  {
    id: 'act-alice-order',
    user: 'Alice Chen',
    action: 'placed an order',
    type: 'order',
    rawAmount: 249.0,
    timeOffset: 2 * 60 * 1000,
    icon: CreditCard,
  },
  {
    id: 'act-bob-subscribe',
    user: 'Bob Smith',
    action: 'subscribed to Pro plan',
    type: 'subscription',
    rawAmount: null,
    timeOffset: 5 * 60 * 1000,
    icon: Star,
  },
  {
    id: 'act-carol-review',
    user: 'Carol Davis',
    action: 'left a 5-star review',
    type: 'review',
    rawAmount: null,
    timeOffset: 12 * 60 * 1000,
    icon: MessageSquare,
  },
  {
    id: 'act-dan-signup',
    user: 'Dan Wilson',
    action: 'created an account',
    type: 'signup',
    rawAmount: null,
    timeOffset: 18 * 60 * 1000,
    icon: UserPlus,
  },
  {
    id: 'act-eve-order',
    user: 'Eve Martinez',
    action: 'placed an order',
    type: 'order',
    rawAmount: 512.0,
    timeOffset: 24 * 60 * 1000,
    icon: CreditCard,
  },
  {
    id: 'act-frank-upgrade',
    user: 'Frank Lee',
    action: 'upgraded to Enterprise',
    type: 'upgrade',
    rawAmount: null,
    timeOffset: 45 * 60 * 1000,
    icon: ShieldCheck,
  },
];

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

const BADGE_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  order: 'default',
  subscription: 'secondary',
  review: 'outline',
  signup: 'secondary',
  upgrade: 'default',
};

/* ────────────────────────────────────────────────────────────────────────
 * Page
 * ──────────────────────────────────────────────────────────────────────── */

export default function DashboardPage() {
  const maxRevenue = Math.max(...WEEKLY_REVENUE.map((d) => d.value));

  /* ── Hooks demos ────────────────────────────────────────────────────── */
  const { isCopied, copy } = useCopyToClipboard();
  const reportDialog = useDisclosure();
  const [dashboardLayout, setDashboardLayout] = useLocalStorage<'grid' | 'list'>(
    'dashboard-layout',
    'grid',
  );

  // Ctrl+N / Cmd+N opens the new-report dialog
  useHotkey('n', () => reportDialog.open(), { meta: true });

  return (
    <ContentContainer>
      {/* ── Page Header ───────────────────────────────────────────────── */}
      <PageHeader
        title="Dashboard"
        description="Key metrics, recent activity, and quick actions at a glance."
        actions={
          <Dialog open={reportDialog.isOpen} onOpenChange={reportDialog.onOpenChange}>
            <Button size="sm" onClick={reportDialog.open}>
              <Plus className="size-4" />
              New Report
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Report</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <p className="text-muted-foreground text-sm">
                  This dialog is controlled by{' '}
                  <code className="bg-muted rounded px-1 py-0.5 text-xs">useDisclosure</code> and
                  can be opened with{' '}
                  <kbd className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 font-mono text-xs">
                    {'⌘'}N
                  </kbd>
                  .
                </p>
                <Separator />
                <p className="text-muted-foreground text-xs">
                  Report generation would go here in a production app.
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={reportDialog.close}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    reportDialog.close();
                    toast.success('Report created!', {
                      description: 'Your new report has been generated.',
                    });
                  }}
                >
                  <FileText className="size-4" />
                  Generate
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {/* ── Stat Cards ────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <Card key={stat.id} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                {stat.label}
              </CardTitle>
              <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                <stat.icon className="size-4" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-foreground text-3xl font-bold tracking-tight">
                {formatStatValue(stat.rawValue, stat.format)}
              </div>
              <div className="flex items-center gap-1 text-xs">
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
              {/* Sparkline-style visual indicator */}
              <Progress value={stat.progress} className="h-1.5" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Revenue Overview — CSS bar chart ──────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Revenue Overview</CardTitle>
          <CardDescription>Weekly revenue (Mon-Fri) using semantic bar colors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-end gap-4">
            {WEEKLY_REVENUE.map((bar) => {
              const height = Math.round((bar.value / maxRevenue) * 100);
              return (
                <Tooltip key={bar.day}>
                  <TooltipTrigger asChild>
                    <div className="flex flex-1 flex-col items-center gap-1">
                      <span className="text-muted-foreground text-[10px] font-medium tabular-nums">
                        {formatCurrency(bar.value, 'USD', { maximumFractionDigits: 0 })}
                      </span>
                      <div className="relative w-full flex-1">
                        <div
                          className="bg-primary/80 hover:bg-primary absolute bottom-0 w-full rounded-t-sm transition-colors"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                      <span className="text-muted-foreground text-xs font-medium">{bar.day}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {bar.day}: {formatCurrency(bar.value, 'USD')}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ── Recent Activity Feed ──────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
          <CardDescription>
            Latest transactions and user actions across the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {RECENT_ACTIVITY.map((item, i) => {
              const ActivityIcon = item.icon;
              return (
                <div key={item.id}>
                  <div className="flex items-center gap-3 py-3">
                    <Avatar className="size-9">
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
                    <div className="flex items-center gap-2">
                      {item.rawAmount != null && (
                        <span className="text-sm font-medium tabular-nums">
                          {formatCurrency(item.rawAmount, 'USD')}
                        </span>
                      )}
                      <Badge variant={BADGE_VARIANT[item.type] ?? 'secondary'}>
                        <ActivityIcon className="mr-1 size-3" />
                        {item.type}
                      </Badge>
                    </div>
                  </div>
                  {i < RECENT_ACTIVITY.length - 1 && <Separator />}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ── Quick Actions — hooks demos ───────────────────────────────── */}
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
              <code className="bg-muted flex-1 truncate rounded px-2 py-1.5 font-mono text-xs">
                {DEMO_API_KEY}
              </code>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    aria-label="Copy API key"
                    onClick={() => {
                      copy(DEMO_API_KEY);
                      toast.success('Copied!', {
                        description: 'API key copied to clipboard.',
                      });
                    }}
                  >
                    {isCopied ? (
                      <Check className="text-primary size-4" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isCopied ? 'Copied!' : 'Copy to clipboard'}</TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>

        {/* Keyboard Shortcut — useHotkey */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Keyboard className="size-4" />
              Hotkey Demo
            </CardTitle>
            <CardDescription>
              Press{' '}
              <kbd className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 font-mono text-xs">
                {'⌘'}N
              </kbd>{' '}
              to open the New Report dialog via <code className="text-xs">useHotkey</code>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between"
              onClick={reportDialog.open}
            >
              Open New Report
              <kbd className="bg-muted text-muted-foreground ml-2 rounded px-1.5 py-0.5 font-mono text-xs">
                {'⌘'}N
              </kbd>
            </Button>
          </CardContent>
        </Card>

        {/* Layout Preference — useLocalStorage */}
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
              Persisted via <code className="text-xs">useLocalStorage</code> — survives page reloads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                variant={dashboardLayout === 'grid' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => {
                  setDashboardLayout('grid');
                  toast.info('Layout changed', { description: 'Switched to grid view.' });
                }}
              >
                <LayoutGrid className="size-4" />
                Grid
              </Button>
              <Button
                variant={dashboardLayout === 'list' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => {
                  setDashboardLayout('list');
                  toast.info('Layout changed', { description: 'Switched to list view.' });
                }}
              >
                <LayoutList className="size-4" />
                List
              </Button>
            </div>
            <p className="text-muted-foreground mt-2 text-xs">
              Current:{' '}
              <Badge variant="secondary" className="ml-1">
                {dashboardLayout}
              </Badge>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Toast Demos ───────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Toast Patterns</CardTitle>
          <CardDescription>
            Success, error, and promise toast patterns powered by Sonner
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast.success('Operation successful!', {
                description: 'Your changes have been saved.',
              })
            }
          >
            Success
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast.error('Something went wrong', {
                description: 'Please try again or contact support.',
              })
            }
          >
            Error
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
                loading: 'Processing your request...',
                success: 'All done!',
                error: 'Request failed.',
              });
            }}
          >
            Promise
          </Button>
        </CardContent>
      </Card>
    </ContentContainer>
  );
}
