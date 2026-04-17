'use client';

import { useState } from 'react';
import { ContentContainer, PageHeader } from '@jonmatum/next-shell/layout';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Input,
} from '@jonmatum/next-shell/primitives';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

type Status = 'active' | 'inactive' | 'pending';

interface Row {
  id: number;
  name: string;
  email: string;
  role: string;
  status: Status;
  joined: string;
}

const ROWS: Row[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 5 === 0 ? 'admin' : i % 3 === 0 ? 'editor' : 'viewer',
  status: (['active', 'inactive', 'pending'] as Status[])[i % 3]!,
  joined: new Date(2024, i % 12, (i % 28) + 1).toLocaleDateString(),
}));

const PAGE_SIZE = 10;

const statusVariant: Record<Status, 'default' | 'secondary' | 'outline'> = {
  active: 'default',
  inactive: 'secondary',
  pending: 'outline',
};

export default function DataPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const filtered = ROWS.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const slice = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <ContentContainer>
      <PageHeader title="Data Table" description="Server-side pagination and filtering demo." />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle className="text-sm">Users ({filtered.length})</CardTitle>
          <div className="relative max-w-xs flex-1">
            <Search className="text-muted-foreground absolute left-2.5 top-2.5 size-4" />
            <Input
              placeholder="Filter users…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slice.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell className="text-muted-foreground">{row.email}</TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[row.status]}>{row.status}</Badge>
                  </TableCell>
                  <TableCell>{row.joined}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between border-t px-4 py-3">
            <span className="text-muted-foreground text-sm">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="size-4" />
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </ContentContainer>
  );
}
