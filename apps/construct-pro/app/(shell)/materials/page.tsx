'use client';

import { useState } from 'react';
import { PlusIcon, AlertTriangleIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { useLiveQuery } from 'dexie-react-hooks';

import { PageHeader, ContentContainer } from '@jonmatum/next-shell/layout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Input,
  Progress,
} from '@jonmatum/next-shell/primitives';
import { formatCurrency, formatDate } from '@jonmatum/next-shell/formatters';

import { db, deleteMaterial } from '@/lib/db';
import type { Material } from '@/lib/db';
import { MaterialModal } from '@/components/modals/material-modal';
import { DeleteConfirm } from '@/components/modals/delete-confirm';

function stockVariant(qty: number, min: number): 'default' | 'secondary' | 'destructive' {
  if (qty === 0) return 'destructive';
  if (qty <= min) return 'destructive';
  if (qty <= min * 1.5) return 'secondary';
  return 'default';
}

function stockLabel(qty: number, min: number) {
  if (qty === 0) return 'Sin Stock';
  if (qty <= min) return 'Crítico';
  if (qty <= min * 1.5) return 'Bajo';
  return 'Normal';
}

export default function MaterialsPage() {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editMaterial, setEditMaterial] = useState<Material | undefined>();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Material | undefined>();
  const [deleting, setDeleting] = useState(false);

  const materials = useLiveQuery(() => db.materials.toArray(), []);
  const projects = useLiveQuery(() => db.projects.toArray(), []);

  const isLoading = materials === undefined || projects === undefined;

  const projectMap = (projects ?? []).reduce<Record<number, string>>((acc, p) => {
    if (p.id) acc[p.id] = p.name;
    return acc;
  }, {});

  const categories = [
    'all',
    ...Array.from(new Set((materials ?? []).map((m) => m.category))).sort(),
  ];

  const filtered = (materials ?? []).filter((mat) => {
    const matchesSearch =
      mat.name.toLowerCase().includes(search.toLowerCase()) ||
      mat.supplier.toLowerCase().includes(search.toLowerCase());
    const matchesCat = filterCategory === 'all' || mat.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  const totalValue = (materials ?? []).reduce((s, m) => s + m.stockQuantity * m.unitCost, 0);
  const criticalCount = (materials ?? []).filter((m) => m.stockQuantity <= m.minStock).length;
  const outOfStock = (materials ?? []).filter((m) => m.stockQuantity === 0).length;

  const openCreate = () => {
    setEditMaterial(undefined);
    setModalOpen(true);
  };

  const openEdit = (mat: Material) => {
    setEditMaterial(mat);
    setModalOpen(true);
  };

  const openDelete = (mat: Material) => {
    setDeleteTarget(mat);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget?.id) return;
    setDeleting(true);
    try {
      await deleteMaterial(deleteTarget.id);
      toast.success(`Material "${deleteTarget.name}" eliminado`);
      setDeleteOpen(false);
      setDeleteTarget(undefined);
    } catch {
      toast.error('Error al eliminar el material');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Inventario de Materiales"
        description="Control de stock y costos de materiales"
        actions={
          <Button onClick={openCreate}>
            <PlusIcon className="size-4" />
            Ingresar Material
          </Button>
        }
      />
      <ContentContainer size="full" className="space-y-5 py-6">
        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-5">
              <p className="text-muted-foreground text-sm">Valor Total en Stock</p>
              {isLoading ? (
                <Skeleton className="mt-1 h-8 w-32" />
              ) : (
                <p className="text-foreground mt-1 text-2xl font-bold">
                  {formatCurrency(totalValue, 'USD')}
                </p>
              )}
              <p className="text-muted-foreground text-xs">
                {(materials ?? []).length} materiales registrados
              </p>
            </CardContent>
          </Card>
          <Card className={criticalCount > 0 ? 'border-destructive/50' : ''}>
            <CardContent className="pt-5">
              <p className="text-muted-foreground text-sm">Stock Crítico / Bajo</p>
              {isLoading ? (
                <Skeleton className="mt-1 h-8 w-12" />
              ) : (
                <p
                  className={`mt-1 text-2xl font-bold ${criticalCount > 0 ? 'text-destructive' : 'text-foreground'}`}
                >
                  {criticalCount}
                </p>
              )}
              <p className="text-muted-foreground text-xs">{outOfStock} sin existencias</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Top Categorías por Valor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {isLoading ? (
                <Skeleton className="h-16 w-full" />
              ) : (
                Array.from(
                  (materials ?? []).reduce((acc, m) => {
                    const v = m.stockQuantity * m.unitCost;
                    acc.set(m.category, (acc.get(m.category) ?? 0) + v);
                    return acc;
                  }, new Map<string, number>()),
                )
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 3)
                  .map(([cat, val]) => (
                    <div key={cat} className="space-y-0.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-foreground">{cat}</span>
                        <span className="text-muted-foreground">{formatCurrency(val, 'USD')}</span>
                      </div>
                      <Progress
                        value={totalValue > 0 ? (val / totalValue) * 100 : 0}
                        className="h-1"
                      />
                    </div>
                  ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={filterCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterCategory(cat)}
            >
              {cat === 'all' ? 'Todas las categorías' : cat}
            </Button>
          ))}
        </div>

        {/* Search */}
        <Input
          placeholder="Buscar por nombre o proveedor…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />

        {/* Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead>Stock / Mínimo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Costo Unitario</TableHead>
                <TableHead className="text-right">Valor Total</TableHead>
                <TableHead>Proyecto</TableHead>
                <TableHead>Últ. Reposición</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={11} className="py-8 text-center">
                    <Skeleton className="mx-auto h-4 w-32" />
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {filtered.map((mat) => {
                    const variant = stockVariant(mat.stockQuantity, mat.minStock);
                    const label = stockLabel(mat.stockQuantity, mat.minStock);
                    const pct =
                      mat.minStock > 0
                        ? Math.min((mat.stockQuantity / (mat.minStock * 2)) * 100, 100)
                        : 100;
                    return (
                      <TableRow key={mat.id}>
                        <TableCell className="text-muted-foreground font-mono text-xs">
                          {mat.code}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            {variant === 'destructive' && (
                              <AlertTriangleIcon className="text-destructive size-3.5 shrink-0" />
                            )}
                            <span className="font-medium">{mat.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {mat.category}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {mat.supplier}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-foreground text-sm font-medium">
                              {mat.stockQuantity.toLocaleString()} / {mat.minStock.toLocaleString()}{' '}
                              {mat.unit}
                            </div>
                            <Progress value={pct} className="h-1.5 w-24" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={variant}>{label}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(mat.unitCost, 'USD')}/{mat.unit}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(mat.stockQuantity * mat.unitCost, 'USD')}
                        </TableCell>
                        <TableCell className="text-sm">
                          {mat.assignedProjectId ? (
                            <span className="text-foreground truncate">
                              {projectMap[mat.assignedProjectId] ?? `ID ${mat.assignedProjectId}`}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">Sin asignar</span>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {formatDate(mat.lastRestocked, { dateStyle: 'medium' })}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openEdit(mat)}
                              aria-label="Editar material"
                            >
                              <PencilIcon className="size-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => openDelete(mat)}
                              aria-label="Eliminar material"
                            >
                              <Trash2Icon className="size-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={11}
                        className="text-muted-foreground py-8 text-center text-sm"
                      >
                        No se encontraron materiales con los filtros actuales.
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </Card>
      </ContentContainer>

      <MaterialModal open={modalOpen} onOpenChange={setModalOpen} material={editMaterial} />

      <DeleteConfirm
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Eliminar Material"
        description={`¿Eliminar "${deleteTarget?.name}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  );
}
