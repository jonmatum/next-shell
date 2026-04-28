'use client';

import { useState } from 'react';
import {
  TrendingUpIcon,
  TrendingDownIcon,
  MinusIcon,
  PlusIcon,
  PencilIcon,
  Trash2Icon,
} from 'lucide-react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@jonmatum/next-shell/primitives';
import { formatCurrency, formatPercent } from '@jonmatum/next-shell/formatters';

import { db, deleteBudgetItem } from '@/lib/db';
import type { BudgetCategory, BudgetItem } from '@/lib/db';
import { BudgetItemModal } from '@/components/modals/budget-item-modal';
import { DeleteConfirm } from '@/components/modals/delete-confirm';

const CATEGORY_LABELS: Record<BudgetCategory, string> = {
  labor: 'Mano de Obra',
  materials: 'Materiales',
  equipment: 'Equipos',
  subcontract: 'Subcontratos',
  overhead: 'Gastos Generales',
};

const CATEGORY_COLORS: Record<BudgetCategory, string> = {
  labor: 'bg-chart-1',
  materials: 'bg-chart-2',
  equipment: 'bg-chart-3',
  subcontract: 'bg-chart-4',
  overhead: 'bg-chart-5',
};

function VarianceIcon({ budgeted, actual }: { budgeted: number; actual: number }) {
  if (actual === 0) return <MinusIcon className="text-muted-foreground size-3.5" />;
  if (actual > budgeted) return <TrendingUpIcon className="text-destructive size-3.5" />;
  return <TrendingDownIcon className="text-success size-3.5" />;
}

export default function BudgetsPage() {
  const projects = useLiveQuery(() => db.projects.toArray(), []);
  const allBudgetItems = useLiveQuery(() => db.budgetItems.toArray(), []);

  const isLoading = projects === undefined || allBudgetItems === undefined;

  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<BudgetItem | undefined>();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BudgetItem | undefined>();
  const [deleting, setDeleting] = useState(false);

  // Pick the first project id once data loads
  const effectiveProjectId =
    selectedProjectId ?? (projects && projects.length > 0 ? (projects[0].id ?? null) : null);

  const project = (projects ?? []).find((p) => p.id === effectiveProjectId);
  const items = (allBudgetItems ?? []).filter((b) => b.projectId === effectiveProjectId);

  const totalBudgeted = items.reduce((s, i) => s + i.budgeted, 0);
  const totalActual = items.reduce((s, i) => s + i.actual, 0);
  const totalVariance = totalBudgeted - totalActual;
  const execPct = totalBudgeted > 0 ? totalActual / totalBudgeted : 0;

  // Portfolio-level aggregates computed from budget items
  const spentByProject = (allBudgetItems ?? []).reduce<Record<number, number>>((acc, item) => {
    acc[item.projectId] = (acc[item.projectId] ?? 0) + item.actual;
    return acc;
  }, {});

  const totalPortfolioBudget = (projects ?? []).reduce((s, p) => s + p.budget, 0);
  const totalPortfolioSpent = Object.values(spentByProject).reduce((s, v) => s + v, 0);
  const overBudgetCount = (projects ?? []).filter(
    (p) => (spentByProject[p.id!] ?? 0) > p.budget,
  ).length;

  const openCreate = () => {
    setEditItem(undefined);
    setModalOpen(true);
  };

  const openEdit = (item: BudgetItem) => {
    setEditItem(item);
    setModalOpen(true);
  };

  const openDelete = (item: BudgetItem) => {
    setDeleteTarget(item);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget?.id) return;
    setDeleting(true);
    try {
      await deleteBudgetItem(deleteTarget.id);
      toast.success('Partida eliminada');
      setDeleteOpen(false);
      setDeleteTarget(undefined);
    } catch {
      toast.error('Error al eliminar la partida');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Presupuestos"
        description="Control presupuestal por proyecto y categoría"
        actions={
          <Button onClick={openCreate}>
            <PlusIcon className="size-4" />
            Nueva Partida
          </Button>
        }
      />
      <ContentContainer size="full" className="space-y-6 py-6">
        {/* Portfolio summary */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-5">
              <p className="text-muted-foreground text-sm">Presupuesto Total Portafolio</p>
              {isLoading ? (
                <Skeleton className="mt-1 h-8 w-32" />
              ) : (
                <p className="text-foreground mt-1 text-2xl font-bold">
                  {formatCurrency(totalPortfolioBudget, 'USD', { notation: 'compact' })}
                </p>
              )}
              <p className="text-muted-foreground text-xs">{(projects ?? []).length} proyectos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <p className="text-muted-foreground text-sm">Total Ejecutado</p>
              {isLoading ? (
                <Skeleton className="mt-1 h-8 w-32" />
              ) : (
                <p className="text-foreground mt-1 text-2xl font-bold">
                  {formatCurrency(totalPortfolioSpent, 'USD', { notation: 'compact' })}
                </p>
              )}
              <p className="text-muted-foreground text-xs">
                {formatPercent(
                  totalPortfolioBudget > 0 ? totalPortfolioSpent / totalPortfolioBudget : 0,
                )}{' '}
                del portafolio
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <p className="text-muted-foreground text-sm">Proyectos sobre presupuesto</p>
              {isLoading ? (
                <Skeleton className="mt-1 h-8 w-12" />
              ) : (
                <p className="text-destructive mt-1 text-2xl font-bold">{overBudgetCount}</p>
              )}
              <p className="text-muted-foreground text-xs">
                de {(projects ?? []).length} proyectos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio bar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Ejecución por Proyecto</CardTitle>
            <CardDescription>Porcentaje presupuestal ejecutado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              (projects ?? []).map((p) => {
                const spent = spentByProject[p.id!] ?? 0;
                const pct = p.budget > 0 ? spent / p.budget : 0;
                const over = spent > p.budget;
                return (
                  <div key={p.id} className="space-y-1">
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="text-foreground font-medium">{p.name}</span>
                      <div className="flex shrink-0 items-center gap-2">
                        <span
                          className={
                            over ? 'text-destructive font-semibold' : 'text-muted-foreground'
                          }
                        >
                          {formatPercent(pct)}
                        </span>
                        {over && (
                          <Badge variant="destructive" className="text-xs">
                            Sobrepasado
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Progress value={Math.min(pct * 100, 100)} className="h-2" />
                    <div className="text-muted-foreground flex justify-between text-xs">
                      <span>
                        Ejecutado: {formatCurrency(spent, 'USD', { notation: 'compact' })}
                      </span>
                      <span>
                        Presupuesto: {formatCurrency(p.budget, 'USD', { notation: 'compact' })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Drill-down by project */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-foreground text-base font-semibold">Detalle por Proyecto</h2>
            {isLoading ? (
              <Skeleton className="h-10 w-64" />
            ) : (
              <Select
                value={effectiveProjectId != null ? String(effectiveProjectId) : ''}
                onValueChange={(v) => setSelectedProjectId(Number(v))}
              >
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Seleccionar proyecto" />
                </SelectTrigger>
                <SelectContent>
                  {(projects ?? []).map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.code} — {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {project && (
            <Tabs defaultValue="summary">
              <TabsList>
                <TabsTrigger value="summary">Resumen</TabsTrigger>
                <TabsTrigger value="detail">Detalle</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="mt-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <Card>
                    <CardContent className="pt-5">
                      <p className="text-muted-foreground text-sm">Presupuesto</p>
                      <p className="text-foreground mt-1 text-xl font-bold">
                        {formatCurrency(totalBudgeted, 'USD')}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-5">
                      <p className="text-muted-foreground text-sm">Ejecutado</p>
                      <p
                        className={`mt-1 text-xl font-bold ${totalActual > totalBudgeted ? 'text-destructive' : 'text-foreground'}`}
                      >
                        {formatCurrency(totalActual, 'USD')}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {formatPercent(execPct)} del total
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-5">
                      <p className="text-muted-foreground text-sm">Varianza</p>
                      <p
                        className={`mt-1 text-xl font-bold ${totalVariance < 0 ? 'text-destructive' : 'text-success'}`}
                      >
                        {totalVariance >= 0 ? '+' : ''}
                        {formatCurrency(totalVariance, 'USD')}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {totalVariance >= 0 ? 'Bajo presupuesto' : 'Sobre presupuesto'}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Category breakdown */}
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-sm">Distribución por Categoría</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {items.map((item) => {
                      const pct = item.budgeted > 0 ? item.actual / item.budgeted : 0;
                      const over = item.actual > item.budgeted;
                      return (
                        <div key={item.id} className="space-y-1.5">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div
                                className={`size-2.5 rounded-full ${CATEGORY_COLORS[item.category]}`}
                              />
                              <span className="text-foreground font-medium">
                                {CATEGORY_LABELS[item.category]}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <VarianceIcon budgeted={item.budgeted} actual={item.actual} />
                              <span className="text-muted-foreground">
                                {formatCurrency(item.actual, 'USD', { notation: 'compact' })} /{' '}
                                {formatCurrency(item.budgeted, 'USD', { notation: 'compact' })}
                              </span>
                              {over && (
                                <Badge variant="destructive" className="text-xs">
                                  +
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Progress value={Math.min(pct * 100, 100)} className="h-1.5" />
                        </div>
                      );
                    })}
                    {items.length === 0 && (
                      <p className="text-muted-foreground text-sm">
                        Sin partidas presupuestales. Agrega una con el botón &quot;Nueva
                        Partida&quot;.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="detail" className="mt-4">
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead className="text-right">Presupuestado</TableHead>
                        <TableHead className="text-right">Ejecutado</TableHead>
                        <TableHead className="text-right">Varianza</TableHead>
                        <TableHead>% Ejecución</TableHead>
                        <TableHead />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item) => {
                        const variance = item.budgeted - item.actual;
                        const pct = item.budgeted > 0 ? item.actual / item.budgeted : 0;
                        return (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div
                                  className={`size-2 rounded-full ${CATEGORY_COLORS[item.category]}`}
                                />
                                <Badge variant="secondary" className="text-xs">
                                  {CATEGORY_LABELS[item.category]}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">{item.description}</TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(item.budgeted, 'USD')}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(item.actual, 'USD')}
                            </TableCell>
                            <TableCell
                              className={`text-right font-semibold ${variance < 0 ? 'text-destructive' : 'text-success'}`}
                            >
                              {variance >= 0 ? '+' : ''}
                              {formatCurrency(variance, 'USD')}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress value={Math.min(pct * 100, 100)} className="h-1.5 w-20" />
                                <span className="text-muted-foreground text-xs">
                                  {formatPercent(pct)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => openEdit(item)}
                                  aria-label="Editar partida"
                                >
                                  <PencilIcon className="size-3.5" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-destructive hover:bg-destructive/10"
                                  onClick={() => openDelete(item)}
                                  aria-label="Eliminar partida"
                                >
                                  <Trash2Icon className="size-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {items.length > 0 && (
                        <TableRow className="border-border border-t-2 font-semibold">
                          <TableCell colSpan={2}>Total</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(totalBudgeted, 'USD')}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(totalActual, 'USD')}
                          </TableCell>
                          <TableCell
                            className={`text-right ${totalVariance < 0 ? 'text-destructive' : 'text-success'}`}
                          >
                            {totalVariance >= 0 ? '+' : ''}
                            {formatCurrency(totalVariance, 'USD')}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={Math.min(execPct * 100, 100)}
                                className="h-1.5 w-20"
                              />
                              <span className="text-muted-foreground text-xs">
                                {formatPercent(execPct)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell />
                        </TableRow>
                      )}
                      {items.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-muted-foreground py-8 text-center text-sm"
                          >
                            Sin partidas presupuestales para este proyecto.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </ContentContainer>

      <BudgetItemModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        budgetItem={editItem}
        lockedProjectId={editItem ? undefined : (effectiveProjectId ?? undefined)}
      />

      <DeleteConfirm
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Eliminar Partida"
        description={`¿Eliminar la partida "${deleteTarget?.description}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  );
}
