'use client';

import { useState } from 'react';
import { ContentContainer, PageHeader } from '@jonmatum/next-shell/layout';
import {
  Badge,
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@jonmatum/next-shell/primitives';
import { formatCurrency, formatDate } from '@jonmatum/next-shell/formatters';
import { ChevronDown, Copy, Eye, Filter, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react';

/* ────────────────────────────────────────────────────────────────────────
 * Types
 * ──────────────────────────────────────────────────────────────────────── */

type InvoiceStatus = 'paid' | 'pending' | 'overdue';

interface Invoice {
  id: string;
  client: string;
  email: string;
  amount: number;
  status: InvoiceStatus;
  date: string;
  dueDate: string;
}

/* ────────────────────────────────────────────────────────────────────────
 * Mock data — 10 realistic invoices
 * ──────────────────────────────────────────────────────────────────────── */

const INVOICES: Invoice[] = [
  {
    id: 'INV-001',
    client: 'Acme Corporation',
    email: 'billing@acme.com',
    amount: 4250.0,
    status: 'paid',
    date: '2026-03-01',
    dueDate: '2026-03-31',
  },
  {
    id: 'INV-002',
    client: 'Globex Industries',
    email: 'accounts@globex.io',
    amount: 1800.5,
    status: 'pending',
    date: '2026-03-15',
    dueDate: '2026-04-15',
  },
  {
    id: 'INV-003',
    client: 'Initech LLC',
    email: 'finance@initech.co',
    amount: 12400.0,
    status: 'paid',
    date: '2026-02-10',
    dueDate: '2026-03-10',
  },
  {
    id: 'INV-004',
    client: 'Umbrella Corp',
    email: 'ap@umbrella.org',
    amount: 3200.75,
    status: 'overdue',
    date: '2026-01-20',
    dueDate: '2026-02-20',
  },
  {
    id: 'INV-005',
    client: 'Stark Enterprises',
    email: 'invoices@stark.com',
    amount: 8750.0,
    status: 'paid',
    date: '2026-03-05',
    dueDate: '2026-04-05',
  },
  {
    id: 'INV-006',
    client: 'Wayne Industries',
    email: 'billing@wayne.com',
    amount: 5600.0,
    status: 'pending',
    date: '2026-04-01',
    dueDate: '2026-05-01',
  },
  {
    id: 'INV-007',
    client: 'Oscorp Technologies',
    email: 'accounts@oscorp.net',
    amount: 920.0,
    status: 'overdue',
    date: '2026-01-05',
    dueDate: '2026-02-05',
  },
  {
    id: 'INV-008',
    client: 'Cyberdyne Systems',
    email: 'finance@cyberdyne.ai',
    amount: 15300.0,
    status: 'paid',
    date: '2026-02-28',
    dueDate: '2026-03-28',
  },
  {
    id: 'INV-009',
    client: 'Massive Dynamic',
    email: 'ap@massive-dynamic.com',
    amount: 2475.25,
    status: 'pending',
    date: '2026-04-10',
    dueDate: '2026-05-10',
  },
  {
    id: 'INV-010',
    client: 'Soylent Corp',
    email: 'billing@soylent.co',
    amount: 6100.0,
    status: 'overdue',
    date: '2025-12-15',
    dueDate: '2026-01-15',
  },
];

/* ────────────────────────────────────────────────────────────────────────
 * Helpers
 * ──────────────────────────────────────────────────────────────────────── */

const STATUS_VARIANT: Record<InvoiceStatus, 'default' | 'secondary' | 'destructive'> = {
  paid: 'default',
  pending: 'secondary',
  overdue: 'destructive',
};

function filterByStatus(invoices: Invoice[], status: string): Invoice[] {
  if (status === 'all') return invoices;
  return invoices.filter((inv) => inv.status === status);
}

/* ────────────────────────────────────────────────────────────────────────
 * Page
 * ──────────────────────────────────────────────────────────────────────── */

export default function DataPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('all');

  const filtered = filterByStatus(INVOICES, activeTab);
  const allSelected = filtered.length > 0 && filtered.every((inv) => selected.has(inv.id));
  const someSelected = filtered.some((inv) => selected.has(inv.id)) && !allSelected;

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((inv) => inv.id)));
    }
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedTotal = INVOICES.filter((inv) => selected.has(inv.id)).reduce(
    (sum, inv) => sum + inv.amount,
    0,
  );

  return (
    <ContentContainer>
      <PageHeader
        title="Invoices"
        description="Manage and track all client invoices."
        actions={
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="size-4" />
                  Filter
                  <ChevronDown className="size-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setActiveTab('all')}>
                  All invoices
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveTab('paid')}>Paid only</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab('pending')}>
                  Pending only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab('overdue')}>
                  Overdue only
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm">
              <Plus className="size-4" />
              New Invoice
            </Button>
          </div>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="all">All ({INVOICES.length})</TabsTrigger>
          <TabsTrigger value="paid">
            Paid ({INVOICES.filter((i) => i.status === 'paid').length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({INVOICES.filter((i) => i.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="overdue">
            Overdue ({INVOICES.filter((i) => i.status === 'overdue').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <TooltipProvider>
            <div className="rounded-md border">
              <Table>
                <TableCaption className="mb-2">
                  A list of your recent invoices. Showing {filtered.length} of {INVOICES.length}{' '}
                  total.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                        onCheckedChange={toggleAll}
                        aria-label="Select all invoices"
                      />
                    </TableHead>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="w-12">
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((invoice) => (
                    <TableRow
                      key={invoice.id}
                      data-state={selected.has(invoice.id) ? 'selected' : undefined}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selected.has(invoice.id)}
                          onCheckedChange={() => toggleOne(invoice.id)}
                          aria-label={`Select ${invoice.id}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{invoice.client}</span>
                          <span className="text-muted-foreground text-xs">{invoice.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(invoice.amount, 'USD')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={STATUS_VARIANT[invoice.status]}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(invoice.date, { dateStyle: 'medium' })}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(invoice.dueDate, { dateStyle: 'medium' })}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-8"
                                  aria-label={`Actions for ${invoice.id}`}
                                >
                                  <MoreHorizontal className="size-4" />
                                </Button>
                              </DropdownMenuTrigger>
                            </TooltipTrigger>
                            <TooltipContent>Actions</TooltipContent>
                          </Tooltip>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="size-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Pencil className="size-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="size-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="size-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>
                      <span className="text-muted-foreground text-sm">
                        {selected.size} of {filtered.length} row(s) selected
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold">
                      {selected.size > 0
                        ? formatCurrency(selectedTotal, 'USD')
                        : formatCurrency(
                            filtered.reduce((sum, inv) => sum + inv.amount, 0),
                            'USD',
                          )}
                    </TableCell>
                    <TableCell colSpan={4}>
                      <span className="text-muted-foreground text-xs">
                        {selected.size > 0 ? 'Selected total' : 'Total'}
                      </span>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </TooltipProvider>
        </TabsContent>
      </Tabs>
    </ContentContainer>
  );
}
