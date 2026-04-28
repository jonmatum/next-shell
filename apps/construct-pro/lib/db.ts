'use client';
import Dexie, { type Table } from 'dexie';

export type ProjectStatus = 'planning' | 'active' | 'on-hold' | 'completed';
export type EquipmentStatus = 'available' | 'in-use' | 'maintenance' | 'retired';
export type MaterialUnit = 'unit' | 'kg' | 'm3' | 'm2' | 'bag' | 'roll' | 'liter';
export type BudgetCategory = 'labor' | 'materials' | 'equipment' | 'subcontract' | 'overhead';

export interface Project {
  id?: number;
  code: string;
  name: string;
  client: string;
  location: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  budget: number;
  manager: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface Equipment {
  id?: number;
  code: string;
  name: string;
  category: string;
  model: string;
  serialNumber: string;
  status: EquipmentStatus;
  assignedProjectId: number | null;
  lastMaintenance: string;
  nextMaintenance: string;
  dailyRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface Material {
  id?: number;
  code: string;
  name: string;
  category: string;
  unit: MaterialUnit;
  stockQuantity: number;
  minStock: number;
  unitCost: number;
  supplier: string;
  lastRestocked: string;
  assignedProjectId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetItem {
  id?: number;
  projectId: number;
  category: BudgetCategory;
  description: string;
  budgeted: number;
  actual: number;
  createdAt: string;
  updatedAt: string;
}

class ConstructProDB extends Dexie {
  projects!: Table<Project>;
  equipment!: Table<Equipment>;
  materials!: Table<Material>;
  budgetItems!: Table<BudgetItem>;

  constructor() {
    super('construct-pro-db');
    this.version(1).stores({
      projects: '++id, &code, status',
      equipment: '++id, &code, &serialNumber, status, assignedProjectId',
      materials: '++id, &code, category, assignedProjectId',
      budgetItems: '++id, projectId, category',
    });
  }
}

export const db = new ConstructProDB();

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

// Cross-reference: deleting a project frees equipment, clears material assignments, removes budget items
export async function deleteProject(id: number): Promise<void> {
  await db.transaction('rw', db.projects, db.equipment, db.materials, db.budgetItems, async () => {
    await db.equipment
      .where('assignedProjectId')
      .equals(id)
      .modify({
        assignedProjectId: null,
        status: 'available' as EquipmentStatus,
        updatedAt: today(),
      });
    await db.materials
      .where('assignedProjectId')
      .equals(id)
      .modify({ assignedProjectId: null, updatedAt: today() });
    await db.budgetItems.where('projectId').equals(id).delete();
    await db.projects.delete(id);
  });
}

// Cross-reference: completing a project frees all its equipment
export async function updateProject(id: number, data: Partial<Project>): Promise<void> {
  await db.transaction('rw', db.projects, db.equipment, async () => {
    await db.projects.update(id, { ...data, updatedAt: today() });
    if (data.status === 'completed') {
      await db.equipment
        .where('assignedProjectId')
        .equals(id)
        .modify({
          assignedProjectId: null,
          status: 'available' as EquipmentStatus,
          updatedAt: today(),
        });
    }
  });
}

export async function deleteEquipment(id: number): Promise<void> {
  await db.equipment.delete(id);
}

export async function deleteMaterial(id: number): Promise<void> {
  await db.materials.delete(id);
}

export async function deleteBudgetItem(id: number): Promise<void> {
  await db.budgetItems.delete(id);
}

// Auto-generate next code like PRJ-004
export async function nextCode(prefix: 'PRJ' | 'EQ' | 'MAT'): Promise<string> {
  const tableMap = { PRJ: db.projects, EQ: db.equipment, MAT: db.materials } as const;
  const count = await tableMap[prefix].count();
  return `${prefix}-${String(count + 1).padStart(3, '0')}`;
}
