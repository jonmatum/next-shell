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
import { db } from '@/lib/db';
import type { BudgetItem, BudgetCategory } from '@/lib/db';
import { toast } from 'sonner';

const schema = z.object({
  projectId: z.coerce.number().positive('Proyecto requerido'),
  category: z.enum(['labor', 'materials', 'equipment', 'subcontract', 'overhead']),
  description: z.string().min(3, 'Descripción requerida'),
  budgeted: z.coerce.number().min(0, 'Monto no puede ser negativo'),
  actual: z.coerce.number().min(0, 'Monto no puede ser negativo'),
});

type FormValues = z.infer<typeof schema>;

const CATEGORY_OPTIONS: { value: BudgetCategory; label: string }[] = [
  { value: 'labor', label: 'Mano de Obra' },
  { value: 'materials', label: 'Materiales' },
  { value: 'equipment', label: 'Equipos' },
  { value: 'subcontract', label: 'Subcontratos' },
  { value: 'overhead', label: 'Gastos Generales' },
];

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  budgetItem?: BudgetItem;
  /** Pre-select a project and lock the selector when drilling in from a project view */
  lockedProjectId?: number;
}

export function BudgetItemModal({ open, onOpenChange, budgetItem, lockedProjectId }: Props) {
  const isEdit = !!budgetItem?.id;
  const projects = useLiveQuery(() => db.projects.toArray(), []);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      projectId: lockedProjectId ?? 0,
      category: 'labor',
      description: '',
      budgeted: 0,
      actual: 0,
    },
  });

  const watchedBudgeted = form.watch('budgeted');
  const watchedActual = form.watch('actual');
  const isOverBudget =
    Number(watchedActual) > Number(watchedBudgeted) && Number(watchedBudgeted) > 0;

  useEffect(() => {
    if (!open) return;
    if (budgetItem) {
      form.reset({
        projectId: budgetItem.projectId,
        category: budgetItem.category,
        description: budgetItem.description,
        budgeted: budgetItem.budgeted,
        actual: budgetItem.actual,
      });
    } else {
      form.reset({
        projectId: lockedProjectId ?? 0,
        category: 'labor',
        description: '',
        budgeted: 0,
        actual: 0,
      });
    }
  }, [open, budgetItem, lockedProjectId, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      const now = new Date().toISOString().slice(0, 10);
      if (isEdit && budgetItem?.id) {
        await db.budgetItems.update(budgetItem.id, { ...values, updatedAt: now });
        toast.success('Partida presupuestal actualizada');
      } else {
        await db.budgetItems.add({ ...values, createdAt: now, updatedAt: now });
        toast.success('Partida presupuestal creada');
      }
      onOpenChange(false);
    } catch {
      toast.error('Error al guardar la partida presupuestal');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Partida' : 'Nueva Partida Presupuestal'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proyecto</FormLabel>
                  <Select
                    onValueChange={(v) => field.onChange(Number(v))}
                    value={field.value > 0 ? String(field.value) : ''}
                    disabled={!!lockedProjectId}
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
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORY_OPTIONS.map((o) => (
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
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Descripción de la partida" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="budgeted"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Presupuestado (USD)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="1000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="actual"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ejecutado (USD)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="1000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {isOverBudget && (
              <p className="text-warning bg-warning/10 rounded-md px-3 py-2 text-sm">
                El monto ejecutado supera el presupuestado. Se guardará igualmente.
              </p>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
