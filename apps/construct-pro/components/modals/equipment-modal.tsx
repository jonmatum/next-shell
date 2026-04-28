'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@jonmatum/next-shell/primitives';
import { db, nextCode } from '@/lib/db';
import type { Equipment, EquipmentStatus } from '@/lib/db';
import { toast } from 'sonner';

const schema = z
  .object({
    code: z.string().min(1, 'Código requerido'),
    name: z.string().min(2, 'Nombre requerido'),
    category: z.string().min(2, 'Categoría requerida'),
    model: z.string().min(1, 'Modelo requerido'),
    serialNumber: z.string().min(1, 'Número de serie requerido'),
    status: z.enum(['available', 'in-use', 'maintenance', 'retired']),
    assignedProjectId: z.coerce.number().nullable(),
    lastMaintenance: z.string().min(1, 'Fecha requerida'),
    nextMaintenance: z.string().min(1, 'Fecha requerida'),
    dailyRate: z.coerce.number().positive('Tarifa debe ser positiva'),
  })
  .superRefine((d, ctx) => {
    if (d.status === 'in-use' && !d.assignedProjectId) {
      ctx.addIssue({
        code: 'custom',
        path: ['assignedProjectId'],
        message: 'Debe asignar un proyecto cuando el equipo está en uso',
      });
    }
  });

type FormValues = z.infer<typeof schema>;

const STATUS_OPTIONS: { value: EquipmentStatus; label: string }[] = [
  { value: 'available', label: 'Disponible' },
  { value: 'in-use', label: 'En Uso' },
  { value: 'maintenance', label: 'Mantenimiento' },
  { value: 'retired', label: 'Dado de Baja' },
];

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  equipment?: Equipment;
}

export function EquipmentModal({ open, onOpenChange, equipment }: Props) {
  const isEdit = !!equipment?.id;
  const projects = useLiveQuery(
    () => db.projects.filter((p) => p.status !== 'completed').toArray(),
    [],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: '',
      name: '',
      category: '',
      model: '',
      serialNumber: '',
      status: 'available',
      assignedProjectId: null,
      lastMaintenance: '',
      nextMaintenance: '',
      dailyRate: 0,
    },
  });

  const watchedStatus = form.watch('status');

  useEffect(() => {
    if (!open) return;
    if (equipment) {
      form.reset({
        code: equipment.code,
        name: equipment.name,
        category: equipment.category,
        model: equipment.model,
        serialNumber: equipment.serialNumber,
        status: equipment.status,
        assignedProjectId: equipment.assignedProjectId,
        lastMaintenance: equipment.lastMaintenance,
        nextMaintenance: equipment.nextMaintenance,
        dailyRate: equipment.dailyRate,
      });
    } else {
      nextCode('EQ').then((code) =>
        form.reset({
          code,
          name: '',
          category: '',
          model: '',
          serialNumber: '',
          status: 'available',
          assignedProjectId: null,
          lastMaintenance: '',
          nextMaintenance: '',
          dailyRate: 0,
        }),
      );
    }
  }, [open, equipment, form]);

  // Clear assignedProjectId when status is not in-use
  useEffect(() => {
    if (watchedStatus !== 'in-use') {
      form.setValue('assignedProjectId', null);
    }
  }, [watchedStatus, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      const now = new Date().toISOString().slice(0, 10);
      const payload = {
        ...values,
        assignedProjectId: values.status === 'in-use' ? values.assignedProjectId : null,
      };
      if (isEdit && equipment?.id) {
        await db.equipment.update(equipment.id, { ...payload, updatedAt: now });
        toast.success('Equipo actualizado');
      } else {
        await db.equipment.add({ ...payload, createdAt: now, updatedAt: now });
        toast.success('Equipo registrado');
      }
      onOpenChange(false);
    } catch (err) {
      if (err instanceof Error && err.message.includes('unique')) {
        form.setError('serialNumber', { message: 'Número de serie ya registrado' });
      } else {
        toast.error('Error al guardar el equipo');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Equipo' : 'Registrar Equipo'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STATUS_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Equipo</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Movimiento de Tierra" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="serialNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Serie</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {watchedStatus === 'in-use' && (
              <FormField
                control={form.control}
                name="assignedProjectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Proyecto Asignado <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={(v) => field.onChange(v === '' ? null : Number(v))}
                      value={field.value != null ? String(field.value) : ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar proyecto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(projects ?? []).map((p) => (
                          <SelectItem key={p.id} value={String(p.id)}>
                            {p.code} — {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="lastMaintenance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Último Mantenimiento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nextMaintenance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Próximo Mantenimiento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="dailyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tarifa Diaria (USD)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Guardando...' : isEdit ? 'Actualizar' : 'Registrar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
