'use client';

import { useState } from 'react';
import {
  PlusIcon,
  WrenchIcon,
  CheckCircle2Icon,
  XCircleIcon,
  CircleDotIcon,
  PencilIcon,
  Trash2Icon,
} from 'lucide-react';
import { toast } from 'sonner';
import { useLiveQuery } from 'dexie-react-hooks';

import { PageHeader, ContentContainer } from '@jonmatum/next-shell/layout';
import {
  Card,
  CardContent,
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
} from '@jonmatum/next-shell/primitives';
import { formatCurrency, formatDate } from '@jonmatum/next-shell/formatters';

import { db, deleteEquipment } from '@/lib/db';
import type { Equipment, EquipmentStatus } from '@/lib/db';
import { EquipmentModal } from '@/components/modals/equipment-modal';
import { DeleteConfirm } from '@/components/modals/delete-confirm';

const STATUS_CONFIG: Record<
  EquipmentStatus,
  {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    icon: React.ElementType;
  }
> = {
  available: { label: 'Disponible', variant: 'default', icon: CheckCircle2Icon },
  'in-use': { label: 'En Uso', variant: 'secondary', icon: CircleDotIcon },
  maintenance: { label: 'Mantenimiento', variant: 'destructive', icon: WrenchIcon },
  retired: { label: 'Dado de Baja', variant: 'outline', icon: XCircleIcon },
};

export default function EquipmentPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<EquipmentStatus | 'all'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editEquipment, setEditEquipment] = useState<Equipment | undefined>();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Equipment | undefined>();
  const [deleting, setDeleting] = useState(false);

  const equipmentList = useLiveQuery(() => db.equipment.toArray(), []);
  const projects = useLiveQuery(() => db.projects.toArray(), []);

  const isLoading = equipmentList === undefined || projects === undefined;

  const projectMap = (projects ?? []).reduce<Record<number, string>>((acc, p) => {
    if (p.id) acc[p.id] = p.name;
    return acc;
  }, {});

  const filtered = (equipmentList ?? []).filter((eq) => {
    const matchesSearch =
      eq.name.toLowerCase().includes(search.toLowerCase()) ||
      eq.model.toLowerCase().includes(search.toLowerCase()) ||
      eq.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || eq.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const counts = {
    all: (equipmentList ?? []).length,
    available: (equipmentList ?? []).filter((e) => e.status === 'available').length,
    'in-use': (equipmentList ?? []).filter((e) => e.status === 'in-use').length,
    maintenance: (equipmentList ?? []).filter((e) => e.status === 'maintenance').length,
    retired: (equipmentList ?? []).filter((e) => e.status === 'retired').length,
  };

  const openCreate = () => {
    setEditEquipment(undefined);
    setModalOpen(true);
  };

  const openEdit = (eq: Equipment) => {
    setEditEquipment(eq);
    setModalOpen(true);
  };

  const openDelete = (eq: Equipment) => {
    setDeleteTarget(eq);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget?.id) return;
    setDeleting(true);
    try {
      await deleteEquipment(deleteTarget.id);
      toast.success(`Equipo "${deleteTarget.name}" eliminado`);
      setDeleteOpen(false);
      setDeleteTarget(undefined);
    } catch {
      toast.error('Error al eliminar el equipo');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Inventario de Equipos"
        description="Gestión y trazabilidad de equipos de construcción"
        actions={
          <Button onClick={openCreate}>
            <PlusIcon className="size-4" />
            Registrar Equipo
          </Button>
        }
      />
      <ContentContainer size="full" className="space-y-5 py-6">
        {/* Status filters */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'available', 'in-use', 'maintenance', 'retired'] as const).map((s) => (
            <Button
              key={s}
              variant={filterStatus === s ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus(s)}
              className="gap-1.5"
            >
              {s !== 'all' &&
                (() => {
                  const Icon = STATUS_CONFIG[s as EquipmentStatus].icon;
                  return <Icon className="size-3.5" />;
                })()}
              {s === 'all' ? 'Todos' : STATUS_CONFIG[s as EquipmentStatus].label}
              <span className="text-muted-foreground ml-1 text-xs">({counts[s]})</span>
            </Button>
          ))}
        </div>

        {/* Search */}
        <Input
          placeholder="Buscar por nombre, modelo o categoría…"
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
                <TableHead>Equipo</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Modelo / Serie</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Proyecto Asignado</TableHead>
                <TableHead>Próx. Mantenimiento</TableHead>
                <TableHead className="text-right">Tarifa Diaria</TableHead>
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
                <>
                  {filtered.map((eq) => {
                    const cfg = STATUS_CONFIG[eq.status];
                    const StatusIcon = cfg.icon;
                    return (
                      <TableRow key={eq.id}>
                        <TableCell className="text-muted-foreground font-mono text-xs">
                          {eq.code}
                        </TableCell>
                        <TableCell className="font-medium">{eq.name}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {eq.category}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{eq.model}</div>
                          <div className="text-muted-foreground font-mono text-xs">
                            {eq.serialNumber}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={cfg.variant} className="gap-1">
                            <StatusIcon className="size-3" />
                            {cfg.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {eq.assignedProjectId ? (
                            <span className="text-foreground">
                              {projectMap[eq.assignedProjectId] ?? `ID ${eq.assignedProjectId}`}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">Sin asignar</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(eq.nextMaintenance, { dateStyle: 'medium' })}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(eq.dailyRate, 'USD')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openEdit(eq)}
                              aria-label="Editar equipo"
                            >
                              <PencilIcon className="size-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => openDelete(eq)}
                              aria-label="Eliminar equipo"
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
                        colSpan={9}
                        className="text-muted-foreground py-8 text-center text-sm"
                      >
                        No se encontraron equipos con los filtros actuales.
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Equipment summary cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(['available', 'in-use', 'maintenance', 'retired'] as const).map((s) => {
            const cfg = STATUS_CONFIG[s];
            const Icon = cfg.icon;
            return (
              <Card key={s}>
                <CardContent className="pt-5">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted flex size-9 items-center justify-center rounded-md">
                      <Icon className="text-muted-foreground size-5" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">{cfg.label}</p>
                      {isLoading ? (
                        <Skeleton className="mt-1 h-6 w-8" />
                      ) : (
                        <p className="text-foreground text-xl font-bold">{counts[s]}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ContentContainer>

      <EquipmentModal open={modalOpen} onOpenChange={setModalOpen} equipment={editEquipment} />

      <DeleteConfirm
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Eliminar Equipo"
        description={`¿Eliminar "${deleteTarget?.name}" (${deleteTarget?.serialNumber})? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  );
}
