'use client';

import { FilterIcon } from 'lucide-react';

import { PageHeader } from '@jonmatum/next-shell/layout';
import {
  Badge,
  Button,
  Card,
  CardContent,
  Progress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@jonmatum/next-shell/primitives';
import { formatDate, formatRelativeTime } from '@jonmatum/next-shell/formatters';

/* ────────────────────────────────────────────────────────────────────────
 * Mock data
 * ──────────────────────────────────────────────────────────────────────── */

type ProjectStatus = 'active' | 'completed' | 'archived';

interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  tasks: number;
  completedTasks: number;
  updatedAt: Date;
}

const NOW = Date.now();

const PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Dashboard Redesign',
    status: 'active',
    tasks: 24,
    completedTasks: 18,
    updatedAt: new Date(NOW - 2 * 60 * 60 * 1000),
  },
  {
    id: 'p2',
    name: 'Backend Overhaul',
    status: 'active',
    tasks: 36,
    completedTasks: 12,
    updatedAt: new Date(NOW - 5 * 60 * 60 * 1000),
  },
  {
    id: 'p3',
    name: 'Mobile App v2',
    status: 'active',
    tasks: 42,
    completedTasks: 31,
    updatedAt: new Date(NOW - 24 * 60 * 60 * 1000),
  },
  {
    id: 'p4',
    name: 'Auth Module',
    status: 'completed',
    tasks: 18,
    completedTasks: 18,
    updatedAt: new Date(NOW - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'p5',
    name: 'Analytics Pipeline',
    status: 'active',
    tasks: 15,
    completedTasks: 4,
    updatedAt: new Date(NOW - 6 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'p6',
    name: 'Legacy Cleanup',
    status: 'archived',
    tasks: 28,
    completedTasks: 28,
    updatedAt: new Date(NOW - 14 * 24 * 60 * 60 * 1000),
  },
];

const STATUS_BADGE_VARIANT: Record<ProjectStatus, 'default' | 'secondary' | 'outline'> = {
  active: 'default',
  completed: 'secondary',
  archived: 'outline',
};

/* ────────────────────────────────────────────────────────────────────────
 * Project table
 * ──────────────────────────────────────────────────────────────────────── */

function ProjectTable({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        No projects match the current filter.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Tasks</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead>Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => {
          const progressValue =
            project.tasks > 0 ? Math.round((project.completedTasks / project.tasks) * 100) : 0;

          return (
            <TableRow key={project.id}>
              <TableCell className="text-foreground font-medium">{project.name}</TableCell>
              <TableCell>
                <Badge variant={STATUS_BADGE_VARIANT[project.status]}>{project.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                {project.completedTasks}/{project.tasks}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={progressValue} className="h-2 w-24" />
                  <span className="text-muted-foreground text-xs">{progressValue}%</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                <span title={formatDate(project.updatedAt, { dateStyle: 'medium' })}>
                  {formatRelativeTime(project.updatedAt)}
                </span>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * Projects page
 * ──────────────────────────────────────────────────────────────────────── */

export default function ProjectsPage() {
  const activeProjects = PROJECTS.filter((p) => p.status === 'active');
  const completedProjects = PROJECTS.filter((p) => p.status === 'completed');
  const archivedProjects = PROJECTS.filter((p) => p.status === 'archived');

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Projects"
        description="Manage and track all your team projects."
        actions={
          <Button variant="outline" size="sm">
            <FilterIcon className="size-4" />
            Filter
          </Button>
        }
      />

      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All ({PROJECTS.length})</TabsTrigger>
              <TabsTrigger value="active">Active ({activeProjects.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedProjects.length})</TabsTrigger>
              <TabsTrigger value="archived">Archived ({archivedProjects.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <ProjectTable projects={PROJECTS} />
            </TabsContent>
            <TabsContent value="active" className="mt-4">
              <ProjectTable projects={activeProjects} />
            </TabsContent>
            <TabsContent value="completed" className="mt-4">
              <ProjectTable projects={completedProjects} />
            </TabsContent>
            <TabsContent value="archived" className="mt-4">
              <ProjectTable projects={archivedProjects} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
