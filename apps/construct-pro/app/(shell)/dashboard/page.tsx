'use client';

import {
  FolderOpenIcon,
  TruckIcon,
  PackageIcon,
  WalletIcon,
  AlertTriangleIcon,
  TrendingUpIcon,
  ClockIcon,
  CheckCircle2Icon,
  BarChart3Icon,
  PieChartIcon,
} from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Legend } from 'recharts';

import { PageHeader, ContentContainer } from '@jonmatum/next-shell/layout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Progress,
  Skeleton,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@jonmatum/next-shell/primitives';
import { formatCurrency, formatPercent } from '@jonmatum/next-shell/formatters';

import { db } from '@/lib/db';
import type { BudgetCategory } from '@/lib/db';

const CATEGORY_LABELS: Record<BudgetCategory, string> = {
  labor: 'Mano de Obra',
  materials: 'Materiales',
  equipment: 'Equipos',
  subcontract: 'Subcontratos',
  overhead: 'G. Generales',
};

const categoryChartConfig = {
  labor: { label: 'Mano de Obra', color: 'var(--color-chart-1)' },
  materials: { label: 'Materiales', color: 'var(--color-chart-2)' },
  equipment: { label: 'Equipos', color: 'var(--color-chart-3)' },
  subcontract: { label: 'Subcontratos', color: 'var(--color-chart-4)' },
  overhead: { label: 'G. Generales', color: 'var(--color-chart-5)' },
} satisfies ChartConfig;

const budgetChartConfig = {
  budget: { label: 'Presupuesto', color: 'var(--color-chart-3)' },
  spent: { label: 'Ejecutado', color: 'var(--color-chart-1)' },
} satisfies ChartConfig;

function KPICard({
  title,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  title: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  accent?: 'primary' | 'success' | 'warning' | 'destructive';
}) {
  const iconClass = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    destructive: 'bg-destructive/10 text-destructive',
  }[accent ?? 'primary'];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-muted-foreground text-sm">{title}</p>
            <p className="text-foreground mt-1 text-2xl font-bold">{value}</p>
            <p className="text-muted-foreground mt-1 text-xs">{sub}</p>
          </div>
          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
          >
            <Icon className="size-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const STATUS_LABELS: Record<string, string> = {
  planning: 'Planificación',
  active: 'Activo',
  'on-hold': 'En Pausa',
  completed: 'Completado',
};

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  planning: 'secondary',
  active: 'default',
  'on-hold': 'destructive',
  completed: 'outline',
};

export default function DashboardPage() {
  const projects = useLiveQuery(() => db.projects.toArray(), []);
  const equipment = useLiveQuery(() => db.equipment.toArray(), []);
  const materials = useLiveQuery(() => db.materials.toArray(), []);
  const budgetItems = useLiveQuery(() => db.budgetItems.toArray(), []);

  const isLoading =
    projects === undefined ||
    equipment === undefined ||
    materials === undefined ||
    budgetItems === undefined;

  if (isLoading) {
    return (
      <>
        <PageHeader
          title="Dashboard"
          description="Resumen general de operaciones y estado de obras"
        />
        <ContentContainer size="full" className="space-y-6 py-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </ContentContainer>
      </>
    );
  }

  const activeProjects = projects.filter((p) => p.status === 'active');
  const availableEquipment = equipment.filter((e) => e.status === 'available').length;
  const inUseEquipment = equipment.filter((e) => e.status === 'in-use').length;
  const lowStockMaterials = materials.filter((m) => m.stockQuantity <= m.minStock);
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const maintenanceEquipment = equipment.filter((e) => e.status === 'maintenance');

  const spentByProject = budgetItems.reduce<Record<number, number>>((acc, item) => {
    acc[item.projectId] = (acc[item.projectId] ?? 0) + item.actual;
    return acc;
  }, {});

  const totalSpent = Object.values(spentByProject).reduce((s, v) => s + v, 0);

  // Expense by category data for donut chart
  const expenseByCategory = budgetItems.reduce<Partial<Record<BudgetCategory, number>>>(
    (acc, item) => {
      acc[item.category] = (acc[item.category] ?? 0) + item.actual;
      return acc;
    },
    {},
  );

  const CATEGORY_CHART_FILLS: Record<BudgetCategory, string> = {
    labor: 'var(--color-chart-1)',
    materials: 'var(--color-chart-2)',
    equipment: 'var(--color-chart-3)',
    subcontract: 'var(--color-chart-4)',
    overhead: 'var(--color-chart-5)',
  };

  const categoryChartData = (Object.entries(expenseByCategory) as [BudgetCategory, number][])
    .filter(([, value]) => value > 0)
    .map(([category, value]) => ({
      category,
      label: CATEGORY_LABELS[category],
      value,
      fill: CATEGORY_CHART_FILLS[category],
    }));

  // Budget vs spent per project for bar chart
  const projectChartData = activeProjects.slice(0, 6).map((p) => ({
    name: p.code ?? p.name.substring(0, 8),
    fullName: p.name,
    budget: p.budget,
    spent: spentByProject[p.id!] ?? 0,
  }));

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Resumen general de operaciones y estado de obras"
      />
      <ContentContainer size="full" className="space-y-6 py-6">
        {/* KPI row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Proyectos Activos"
            value={String(activeProjects.length)}
            sub={`${projects.length} proyectos en total`}
            icon={FolderOpenIcon}
            accent="primary"
          />
          <KPICard
            title="Equipos Disponibles"
            value={String(availableEquipment)}
            sub={`${inUseEquipment} en uso · ${maintenanceEquipment.length} en mantenimiento`}
            icon={TruckIcon}
            accent="success"
          />
          <KPICard
            title="Alertas de Stock"
            value={String(lowStockMaterials.length)}
            sub="Materiales bajo nivel mínimo"
            icon={PackageIcon}
            accent={lowStockMaterials.length > 0 ? 'warning' : 'success'}
          />
          <KPICard
            title="Presupuesto Total"
            value={formatCurrency(totalBudget, 'USD', { notation: 'compact' })}
            sub={`${formatCurrency(totalSpent, 'USD', { notation: 'compact' })} ejecutado (${formatPercent(totalBudget > 0 ? totalSpent / totalBudget : 0)})`}
            icon={WalletIcon}
            accent="primary"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Active projects */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUpIcon className="size-4" />
                Proyectos en Ejecución
              </CardTitle>
              <CardDescription>Estado y avance de obras activas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeProjects.map((project) => {
                const spent = spentByProject[project.id!] ?? 0;
                return (
                  <div key={project.id} className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-foreground truncate text-sm font-medium">
                          {project.name}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {project.client} · {project.location}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="text-muted-foreground text-xs">{project.progress}%</span>
                        <Badge variant={STATUS_VARIANT[project.status]}>
                          {STATUS_LABELS[project.status]}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={project.progress} className="h-1.5" />
                    <div className="text-muted-foreground flex justify-between text-xs">
                      <span>
                        Presupuesto:{' '}
                        {formatCurrency(project.budget, 'USD', { notation: 'compact' })}
                      </span>
                      <span>
                        Ejecutado: {formatCurrency(spent, 'USD', { notation: 'compact' })}
                      </span>
                    </div>
                  </div>
                );
              })}
              {activeProjects.length === 0 && (
                <p className="text-muted-foreground text-sm">No hay proyectos activos.</p>
              )}
            </CardContent>
          </Card>

          {/* Alerts panel */}
          <div className="space-y-4">
            {/* Low stock */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <AlertTriangleIcon className="text-warning size-4" />
                  Stock Crítico
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {lowStockMaterials.length === 0 ? (
                  <div className="text-success flex items-center gap-2 text-sm">
                    <CheckCircle2Icon className="size-4" />
                    Todo en niveles normales
                  </div>
                ) : (
                  lowStockMaterials.map((mat) => (
                    <div key={mat.id} className="flex items-center justify-between gap-2">
                      <p className="text-foreground truncate text-xs font-medium">{mat.name}</p>
                      <Badge variant="destructive" className="shrink-0 text-xs">
                        {mat.stockQuantity} / {mat.minStock} {mat.unit}
                      </Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Equipment maintenance */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <ClockIcon className="text-warning size-4" />
                  En Mantenimiento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {maintenanceEquipment.length === 0 ? (
                  <div className="text-success flex items-center gap-2 text-sm">
                    <CheckCircle2Icon className="size-4" />
                    Sin equipos en taller
                  </div>
                ) : (
                  maintenanceEquipment.map((eq) => (
                    <div key={eq.id} className="space-y-0.5">
                      <p className="text-foreground text-xs font-medium">{eq.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {eq.model} · {eq.serialNumber}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Budget health */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <WalletIcon className="text-primary size-4" />
                  Ejecución Presupuestal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {projects
                  .filter((p) => p.status === 'active' || p.status === 'on-hold')
                  .map((p) => {
                    const spent = spentByProject[p.id!] ?? 0;
                    const pct = p.budget > 0 ? spent / p.budget : 0;
                    return (
                      <div key={p.id} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-foreground truncate font-medium">{p.code}</span>
                          <span className="text-muted-foreground shrink-0">
                            {formatPercent(pct)}
                          </span>
                        </div>
                        <Progress value={pct * 100} className="h-1" />
                      </div>
                    );
                  })}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Charts row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Expense by category — donut */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="size-4" />
                Gasto por Categoría
              </CardTitle>
              <CardDescription>Distribución de gastos ejecutados por rubro</CardDescription>
            </CardHeader>
            <CardContent>
              {categoryChartData.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center text-sm">
                  Sin gastos registrados aún.
                </p>
              ) : (
                <ChartContainer config={categoryChartConfig} className="mx-auto max-h-64">
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      dataKey="value"
                      nameKey="label"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={2}
                      stroke="transparent"
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value: unknown) =>
                            formatCurrency(Number(value ?? 0), 'USD', { notation: 'compact' })
                          }
                        />
                      }
                    />
                    <Legend
                      formatter={(value: string) => (
                        <span className="text-muted-foreground text-xs">{value}</span>
                      )}
                    />
                  </PieChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          {/* Budget vs spent per project — horizontal bars */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3Icon className="size-4" />
                Presupuesto vs Ejecutado
              </CardTitle>
              <CardDescription>Comparativo por proyecto activo</CardDescription>
            </CardHeader>
            <CardContent>
              {projectChartData.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center text-sm">
                  Sin proyectos activos.
                </p>
              ) : (
                <ChartContainer config={budgetChartConfig} className="max-h-64">
                  <BarChart data={projectChartData} layout="vertical" barCategoryGap="30%">
                    <CartesianGrid
                      horizontal={false}
                      stroke="var(--color-border)"
                      strokeDasharray="3 3"
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={56}
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <XAxis
                      type="number"
                      tickFormatter={(v: number) =>
                        formatCurrency(v, 'USD', { notation: 'compact' })
                      }
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value: unknown) =>
                            formatCurrency(Number(value ?? 0), 'USD', { notation: 'compact' })
                          }
                        />
                      }
                    />
                    <Bar dataKey="budget" fill="var(--color-budget)" radius={[0, 3, 3, 0]} />
                    <Bar dataKey="spent" fill="var(--color-spent)" radius={[0, 3, 3, 0]} />
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </ContentContainer>
    </>
  );
}
