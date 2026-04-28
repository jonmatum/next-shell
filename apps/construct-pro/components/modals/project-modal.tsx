'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { db, updateProject, nextCode } from '@/lib/db';
import type { Project, ProjectStatus } from '@/lib/db';
import { toast } from 'sonner';

const schema = z
  .object({
    code: z.string().min(1, 'Código requerido'),
    name: z.string().min(2, 'Nombre requerido'),
    client: z.string().min(2, 'Cliente requerido'),
    location: z.string().min(2, 'Ubicación requerida'),
    status: z.enum(['planning', 'active', 'on-hold', 'completed']),
    startDate: z.string().min(1, 'Fecha inicio requerida'),
    endDate: z.string().min(1, 'Fecha fin requerida'),
    budget: z.coerce.number().positive('Presupuesto debe ser positivo'),
    manager: z.string().min(2, 'Responsable requerido'),
    progress: z.coerce.number().min(0).max(100),
  })
  .refine((d) => d.endDate >= d.startDate, {
    message: 'Fecha fin debe ser posterior a fecha inicio',
    path: ['endDate'],
  });

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  project?: Project;
}

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: 'planning', label: 'Planificación' },
  { value: 'active', label: 'Activo' },
  { value: 'on-hold', label: 'En Pausa' },
  { value: 'completed', label: 'Completado' },
];

export function ProjectModal({ open, onOpenChange, project }: Props) {
  const isEdit = !!project?.id;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: '',
      name: '',
      client: '',
      location: '',
      status: 'planning',
      startDate: '',
      endDate: '',
      budget: 0,
      manager: '',
      progress: 0,
    },
  });

  useEffect(() => {
    if (!open) return;
    if (project) {
      form.reset({
        code: project.code,
        name: project.name,
        client: project.client,
        location: project.location,
        status: project.status,
        startDate: project.startDate,
        endDate: project.endDate,
        budget: project.budget,
        manager: project.manager,
        progress: project.progress,
      });
    } else {
      nextCode('PRJ').then((code) =>
        form.reset({
          code,
          name: '',
          client: '',
          location: '',
          status: 'planning',
          startDate: '',
          endDate: '',
          budget: 0,
          manager: '',
          progress: 0,
        }),
      );
    }
  }, [open, project, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      const now = new Date().toISOString().slice(0, 10);
      if (isEdit && project?.id) {
        await updateProject(project.id, { ...values });
        toast.success('Proyecto actualizado');
      } else {
        await db.projects.add({ ...values, createdAt: now, updatedAt: now });
        toast.success('Proyecto creado');
      }
      onOpenChange(false);
    } catch (err) {
      if (err instanceof Error && err.message.includes('unique')) {
        form.setError('code', { message: 'Este código ya existe' });
      } else {
        toast.error('Error al guardar el proyecto');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Proyecto' : 'Nuevo Proyecto'}</DialogTitle>
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
                      <Input {...field} placeholder="PRJ-001" />
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
                  <FormLabel>Nombre del Proyecto</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Torre Residencial Mirador" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="client"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nombre del cliente" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="manager"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsable</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nombre del responsable" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ubicación</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="San José, Costa Rica" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha Inicio</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha Fin</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Presupuesto (USD)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="1000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="progress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avance (%)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
