'use client';

import {
  FolderKanbanIcon,
  ListChecksIcon,
  UsersIcon,
  CheckCircle2Icon,
  PlusIcon,
} from 'lucide-react';

import { PageHeader } from '@jonmatum/next-shell/layout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Textarea,
} from '@jonmatum/next-shell/primitives';
import { formatNumber, formatPercent } from '@jonmatum/next-shell/formatters';
import { formatRelativeTime } from '@jonmatum/next-shell/formatters';
import { useDisclosure } from '@jonmatum/next-shell/hooks';
import { SignedIn } from '@jonmatum/next-shell/auth';

/* ────────────────────────────────────────────────────────────────────────
 * Stat cards data
 * ──────────────────────────────────────────────────────────────────────── */

const STATS = [
  {
    label: 'Active Projects',
    value: 12,
    icon: <FolderKanbanIcon className="text-muted-foreground size-5" />,
    change: 0.08,
  },
  {
    label: 'Open Tasks',
    value: 47,
    icon: <ListChecksIcon className="text-muted-foreground size-5" />,
    change: -0.03,
  },
  {
    label: 'Team Members',
    value: 8,
    icon: <UsersIcon className="text-muted-foreground size-5" />,
    change: 0.125,
  },
  {
    label: 'Completed This Week',
    value: 23,
    icon: <CheckCircle2Icon className="text-muted-foreground size-5" />,
    change: 0.15,
  },
] as const;

/* ────────────────────────────────────────────────────────────────────────
 * Recent activity data
 * ──────────────────────────────────────────────────────────────────────── */

const NOW = Date.now();

const RECENT_ACTIVITY = [
  {
    id: '1',
    description: 'Sarah Chen completed task "API integration tests"',
    project: 'Backend Overhaul',
    timestamp: new Date(NOW - 15 * 60 * 1000), // 15 min ago
    type: 'completed' as const,
  },
  {
    id: '2',
    // eslint-disable-next-line next-shell/no-raw-colors -- PR number, not a color
    description: 'Marcus Rivera opened PR #234 for auth refactor',
    project: 'Auth Module',
    timestamp: new Date(NOW - 2 * 60 * 60 * 1000), // 2 hours ago
    type: 'created' as const,
  },
  {
    id: '3',
    description: 'Priya Patel moved "Design review" to In Progress',
    project: 'Mobile App v2',
    timestamp: new Date(NOW - 5 * 60 * 60 * 1000), // 5 hours ago
    type: 'updated' as const,
  },
  {
    id: '4',
    description: 'Alex Kim added 3 new tasks to Sprint 14',
    project: 'Dashboard Redesign',
    timestamp: new Date(NOW - 24 * 60 * 60 * 1000), // 1 day ago
    type: 'created' as const,
  },
  {
    id: '5',
    description: 'Jordan Lee archived project "Legacy Cleanup"',
    project: 'Legacy Cleanup',
    timestamp: new Date(NOW - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    type: 'archived' as const,
  },
];

const ACTIVITY_BADGE_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> =
  {
    completed: 'default',
    created: 'secondary',
    updated: 'outline',
    archived: 'outline',
  };

/* ────────────────────────────────────────────────────────────────────────
 * Dashboard page
 * ──────────────────────────────────────────────────────────────────────── */

export default function DashboardPage() {
  const createProject = useDisclosure();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Dashboard"
        description="Overview of your projects and team activity."
        actions={
          <SignedIn>
            <Button onClick={createProject.open}>
              <PlusIcon className="size-4" />
              Create Project
            </Button>
          </SignedIn>
        }
      />

      {/* ── Stat cards ─────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                {stat.label}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-foreground text-2xl font-bold">{formatNumber(stat.value)}</div>
              <p className="text-muted-foreground mt-1 text-xs">
                {stat.change >= 0 ? '+' : ''}
                {formatPercent(stat.change)} from last week
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Recent activity ────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {RECENT_ACTIVITY.map((activity) => (
              <div
                key={activity.id}
                className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="text-foreground text-sm">{activity.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={ACTIVITY_BADGE_VARIANT[activity.type]}>{activity.type}</Badge>
                    <span className="text-muted-foreground text-xs">{activity.project}</span>
                  </div>
                </div>
                <span className="text-muted-foreground shrink-0 text-xs">
                  {formatRelativeTime(activity.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Create project dialog ──────────────────────────────────── */}
      <Dialog open={createProject.isOpen} onOpenChange={createProject.onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Add a new project to your workspace. Fill in the details below.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input id="project-name" placeholder="e.g. Mobile App v3" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="project-description">Description</Label>
              <Textarea
                id="project-description"
                placeholder="Briefly describe the project goals..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={createProject.close}>
              Cancel
            </Button>
            <Button onClick={createProject.close}>Create Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
