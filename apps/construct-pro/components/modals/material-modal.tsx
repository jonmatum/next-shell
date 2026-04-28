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
import type { Material, MaterialUnit } from '@/lib/db';
import { toast } from 'sonner';

const schema = z.object({
  code: z.string().min(1, 'Código requerido'),
  name: z.string().min(2, 'Nombre requerido'),
  category: z.string().min(2, 'Categoría requerida'),
  unit: z.enum(['unit', 'kg', 'm3', 'm2', 'bag', 'roll', 'liter']),
  stockQuantity: z.coerce.number().min(0, 'Stock no puede ser negativo'),
  minStock: z.coerce.number().min(0, 'Stock mínimo no puede ser negativo'),
  unitCost: z.coerce.number().positive('Costo debe ser positivo'),
  supplier: z.string().min(2, 'Proveedor requerido'),
  lastRestocked: z.string().min(1, 'Fecha de reposición requerida'),
  assignedProjectId: z.coerce.number().nullable(),
});

type FormValues = z.infer<typeof schema>;

const UNIT_OPTIONS: { value: MaterialUnit; label: string }[] = [
  { value: 'unit', label: 'Unidad' },
  { value: 'kg', label: 'Kilogramo (kg)' },
  { value: 'm3', label: 'Metro cúbico (m³)' },
  { value: 'm2', label: 'Metro cuadrado (m²)' },
  { value: 'bag', label: 'Bolsa' },
  { value: 'roll', label: 'Rollo' },
  { value: 'liter', label: 'Litro' },
];

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  material?: Material;
}

export function MaterialModal({ open, onOpenChange, material }: Props) {
  const isEdit = !!material?.id;
  const projects = useLiveQuery(() => db.projects.toArray(), []);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: '',
      name: '',
      category: '',
      unit: 'unit',
      stockQuantity: 0,
      minStock: 0,
      unitCost: 0,
      supplier: '',
      lastRestocked: '',
      assignedProjectId: null,
    },
  });

  useEffect(() => {
    if (!open) return;
    if (material) {
      form.reset({
        code: material.code,
        name: material.name,
        category: material.category,
        unit: material.unit,
        stockQuantity: material.stockQuantity,
        minStock: material.minStock,
        unitCost: material.unitCost,
        supplier: material.supplier,
        lastRestocked: material.lastRestocked,
        assignedProjectId: material.assignedProjectId,
      });
    } else {
      nextCode('MAT').then((code) =>
        form.reset({
          code,
          name: '',
          category: '',
          unit: 'unit',
          stockQuantity: 0,
          minStock: 0,
          unitCost: 0,
          supplier: '',
          lastRestocked: '',
          assignedProjectId: null,
        }),
      );
    }
  }, [open, material, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      const now = new Date().toISOString().slice(0, 10);
      if (isEdit && material?.id) {
        await db.materials.update(material.id, { ...values, updatedAt: now });
        toast.success('Material actualizado');
      } else {
        await db.materials.add({ ...values, createdAt: now, updatedAt: now });
        toast.success('Material registrado');
      }
      onOpenChange(false);
    } catch (err) {
      if (err instanceof Error && err.message.includes('unique')) {
        form.setError('code', { message: 'Este código ya existe' });
      } else {
        toast.error('Error al guardar el material');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Material' : 'Registrar Material'}</DialogTitle>
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
                      <Input {...field} placeholder="MAT-001" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidad</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {UNIT_OPTIONS.map((o) => (
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
                  <FormLabel>Nombre del Material</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Cemento Portland Tipo I" />
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
                      <Input {...field} placeholder="Aglomerantes" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="supplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proveedor</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nombre del proveedor" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="stockQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Actual</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="minStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Mínimo</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unitCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Costo Unitario (USD)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="lastRestocked"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Última Reposición</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="assignedProjectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proyecto Asignado (opcional)</FormLabel>
                  <Select
                    onValueChange={(v) => field.onChange(v === 'none' ? null : Number(v))}
                    value={field.value != null ? String(field.value) : 'none'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sin asignar" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Sin asignar</SelectItem>
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
