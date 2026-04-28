'use client';

import { useState } from 'react';
import { PlusIcon, MapPinIcon, CalendarIcon, UserIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { useLiveQuery } from 'dexie-react-hooks';

import { PageHeader, ContentContainer } from '@jonmatum/next-shell/layout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Button,
  Progress,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@jonmatum/next-shell/primitives';
import { formatCurrency, formatDate, formatPercent } from '@jonmatum/next-shell/formatters';

import { db, deleteProject } from '@/lib/db';
import type { Project, ProjectStatus } from '@/lib/db';
import { ProjectModal } from '@/components/modals/project-modal';
import { DeleteConfirm } from '@/components/modals/delete-confirm';

const STATUS_LABELS: Record<ProjectStatus, string> = {
  planning: 'Planificación',
  active: 'Activo',
  'on-hold': 'En Pausa',
  completed: 'Completado',
};

const STATUS_VARIANT: Record<ProjectStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  planning: 'secondary',
  active: 'default',
  'on-hold': 'destructive',
  completed: 'outline',
};

export default function ProjectsPage() {
  const [tab, setTab] = useState<'all' | ProjectStatus>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | undefined>();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Project | undefined>();
  const [deleting, setDeleting] = useState(false);

  const projects = useLiveQuery(() => db.projects.toArray(), []);
  const budgetItems = useLiveQuery(() => db.budgetItems.toArray(), []);

  const isLoading = projects === undefined || budgetItems === undefined;

  const spentByProject = (budgetItems ?? []).reduce<Record<number, number>>((acc, item) => {
    acc[item.projectId] = (acc[item.projectId] ?? 0) + item.actual;
    return acc;
  }, {});

  const filtered =
    projects === undefined
      ? []
      : tab === 'all'
        ? projects
        : projects.filter((p) => p.status === tab);

  const openCreate = () => {
    setEditProject(undefined);
    setModalOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditProject(project);
    setModalOpen(true);
  };

  const openDelete = (project: Project) => {
    setDeleteTarget(project);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget?.id) return;
    setDeleting(true);
    try {
      await deleteProject(deleteTarget.id);
      toast.success(`Proyecto "${deleteTarget.name}" eliminado`);
      setDeleteOpen(false);
      setDeleteTarget(undefined);
    } catch {
      toast.error('Error al eliminar el proyecto');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Proyectos"
        description="Gestión de proyectos de construcción"
        actions={
          <Button onClick={openCreate}>
            <PlusIcon className="size-4" />
            Nuevo Proyecto
          </Button>
        }
      />
      <ContentContainer size="full" className="space-y-6 py-6">
        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-5">
          {(['all', 'active', 'planning', 'on-hold', 'completed'] as const).map((s) => {
            const count =
              projects === undefined
                ? 0
                : s === 'all'
                  ? projects.length
                  : projects.filter((p) => p.status === s).length;
            return (
              <Card
                key={s}
                className={`cursor-pointer transition-colors ${tab === s ? 'border-primary bg-primary/5' : 'hover:bg-accent/50'}`}
                onClick={() => setTab(s)}
              >
                <CardContent className="pb-4 pt-4">
                  <p className="text-muted-foreground text-xs capitalize">
                    {s === 'all' ? 'Todos' : STATUS_LABELS[s as ProjectStatus]}
                  </p>
                  {isLoading ? (
                    <Skeleton className="mt-1 h-8 w-12" />
                  ) : (
                    <p className="text-foreground text-2xl font-bold">{count}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Grid / Table view */}
        <Tabs defaultValue="grid">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="grid">Tarjetas</TabsTrigger>
              <TabsTrigger value="table">Tabla</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="grid" className="mt-4">
            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="pt-4">
                      <Skeleton className="h-32 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((project) => {
                  const spent = spentByProject[project.id!] ?? 0;
                  return (
                    <Card key={project.id} className="flex flex-col">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <CardTitle className="text-base">{project.name}</CardTitle>
                            <CardDescription className="mt-0.5 text-xs">
                              {project.code}
                            </CardDescription>
                          </div>
                          <Badge variant={STATUS_VARIANT[project.status]} className="shrink-0">
                            {STATUS_LABELS[project.status]}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 space-y-3">
                        <div className="space-y-1 text-sm">
                          <div className="text-muted-foreground flex items-center gap-1.5">
                            <UserIcon className="size-3.5" />
                            <span>{project.client}</span>
                          </div>
                          <div className="text-muted-foreground flex items-center gap-1.5">
                            <MapPinIcon className="size-3.5" />
                            <span>{project.location}</span>
                          </div>
                          <div className="text-muted-foreground flex items-center gap-1.5">
                            <CalendarIcon className="size-3.5" />
                            <span>
                              {formatDate(project.startDate, { dateStyle: 'medium' })} →{' '}
                              {formatDate(project.endDate, { dateStyle: 'medium' })}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Avance</span>
                            <span className="text-foreground font-medium">{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-1.5" />
                        </div>

                        <div className="border-border border-t pt-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Presupuesto</span>
                            <span className="text-foreground font-semibold">
                              {formatCurrency(project.budget, 'USD')}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Ejecutado</span>
                            <span
                              className={
                                spent > project.budget
                                  ? 'text-destructive font-semibold'
                                  : 'text-foreground font-semibold'
                              }
                            >
                              {formatCurrency(spent, 'USD')} (
                              {project.budget > 0 ? formatPercent(spent / project.budget) : '0%'})
                            </span>
                          </div>
                          <div className="text-muted-foreground mt-1 text-xs">
                            Responsable: {project.manager}
                          </div>
                        </div>

                        <div className="flex gap-2 pt-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => openEdit(project)}
                          >
                            <PencilIcon className="size-3.5" />
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => openDelete(project)}
                          >
                            <Trash2Icon className="size-3.5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="table" className="mt-4">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Presupuesto</TableHead>
                    <TableHead className="text-right">Ejecutado</TableHead>
                    <TableHead>Avance</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="py-8 text-center">
                        <Skeleton className="mx-auto h-4 w-32" />
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((project) => {
                      const spent = spentByProject[project.id!] ?? 0;
                      return (
                        <TableRow key={project.id}>
                          <TableCell className="text-muted-foreground font-mono text-xs">
                            {project.code}
                          </TableCell>
                          <TableCell className="font-medium">{project.name}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {project.client}
                          </TableCell>
                          <TableCell>
                            <Badge variant={STATUS_VARIANT[project.status]}>
                              {STATUS_LABELS[project.status]}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(project.budget, 'USD')}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={spent > project.budget ? 'text-destructive' : ''}>
                              {formatCurrency(spent, 'USD')}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={project.progress} className="h-1.5 w-16" />
                              <span className="text-muted-foreground text-xs">
                                {project.progress}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {project.manager}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openEdit(project)}
                                aria-label="Editar proyecto"
                              >
                                <PencilIcon className="size-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:bg-destructive/10"
                                onClick={() => openDelete(project)}
                                aria-label="Eliminar proyecto"
                              >
                                <Trash2Icon className="size-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </ContentContainer>

      <ProjectModal open={modalOpen} onOpenChange={setModalOpen} project={editProject} />

      <DeleteConfirm
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Eliminar Proyecto"
        description={`¿Eliminar "${deleteTarget?.name}"? Se liberarán todos los equipos y materiales asignados y se eliminarán las partidas presupuestales de este proyecto.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  );
}
