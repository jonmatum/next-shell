'use client';

import { ContentContainer, PageHeader, EmptyState, ErrorState } from '@jonmatum/next-shell/layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@jonmatum/next-shell/primitives';
import {
  SignedIn,
  SignedOut,
  RoleGate,
  useUser,
  useSession,
  useHasPermission,
} from '@jonmatum/next-shell/auth';
import {
  Shield,
  Users,
  Activity,
  CheckCircle2,
  XCircle,
  Lock,
  Eye,
  CreditCard,
} from 'lucide-react';

/* ────────────────────────────────────────────────────────────────────────
 * Mock users table data
 * ──────────────────────────────────────────────────────────────────────── */

const MOCK_USERS = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    image: null,
    role: 'admin',
    status: 'active' as const,
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    image: null,
    role: 'editor',
    status: 'active' as const,
  },
  {
    id: '3',
    name: 'Carol Lee',
    email: 'carol@example.com',
    image: null,
    role: 'viewer',
    status: 'inactive' as const,
  },
  {
    id: '4',
    name: 'Dave Park',
    email: 'dave@example.com',
    image: null,
    role: 'billing',
    status: 'active' as const,
  },
  {
    id: '5',
    name: 'Eve Torres',
    email: 'eve@example.com',
    image: null,
    role: 'editor',
    status: 'pending' as const,
  },
];

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

/* ────────────────────────────────────────────────────────────────────────
 * User Info Card
 * ──────────────────────────────────────────────────────────────────────── */

function UserInfoCard() {
  const user = useUser();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        <Avatar className="size-10">
          {user?.image && <AvatarImage src={user.image} alt={user.name ?? 'User'} />}
          <AvatarFallback>{getInitials(user?.name ?? 'U')}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-sm">Current User</CardTitle>
          <CardDescription>{user?.email ?? 'No email'}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-1">
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Name</p>
          <p className="text-sm font-medium">{user?.name ?? 'Unknown'}</p>
        </div>
        <div className="grid gap-1">
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
            Email
          </p>
          <p className="text-sm font-medium">{user?.email ?? 'N/A'}</p>
        </div>
        <div className="grid gap-1">
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
            Roles
          </p>
          <div className="flex flex-wrap gap-1">
            {(user?.roles ?? []).map((r) => (
              <Badge key={r} variant="secondary">
                {r}
              </Badge>
            ))}
            {(!user?.roles || user.roles.length === 0) && (
              <span className="text-muted-foreground text-sm">No roles assigned</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * Session Status Card
 * ──────────────────────────────────────────────────────────────────────── */

function SessionStatusCard() {
  const { data, status } = useSession();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Activity className="text-primary size-4" />
        <CardTitle className="text-sm">Session Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">Status:</span>
          <Badge variant={status === 'authenticated' ? 'default' : 'outline'}>{status}</Badge>
        </div>
        <div className="grid gap-1">
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
            Expires
          </p>
          <p className="text-sm font-medium">
            {data?.expires
              ? new Date(data.expires).toLocaleString(undefined, {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })
              : 'N/A'}
          </p>
        </div>
        <div className="grid gap-1">
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
            User ID
          </p>
          <p className="font-mono text-sm">{data?.user?.id ?? 'N/A'}</p>
        </div>
      </CardContent>
    </Card>
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * Permission Checker Card
 * ──────────────────────────────────────────────────────────────────────── */

const PERMISSION_CHECKS = [
  { label: 'admin', icon: Shield },
  { label: 'editor', icon: Eye },
  { label: 'viewer', icon: Eye },
  { label: 'billing', icon: CreditCard },
] as const;

function PermissionCheckerCard() {
  const isAdmin = useHasPermission('admin');
  const isEditor = useHasPermission('editor');
  const isViewer = useHasPermission('viewer');
  const isBilling = useHasPermission('billing');

  const results = [isAdmin, isEditor, isViewer, isBilling];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Lock className="text-primary size-4" />
        <CardTitle className="text-sm">Permission Checker</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-3 text-xs">
          Uses{' '}
          <code className="text-foreground bg-muted rounded px-1 font-mono">useHasPermission</code>{' '}
          to check if the current user holds each role.
        </p>
        <div className="space-y-2">
          {PERMISSION_CHECKS.map((check, i) => {
            const Icon = check.icon;
            const granted = results[i];
            return (
              <div key={check.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="text-muted-foreground size-3.5" />
                  <span className="text-sm font-medium">{check.label}</span>
                </div>
                {granted ? (
                  <div className="text-primary flex items-center gap-1 text-sm">
                    <CheckCircle2 className="size-3.5" />
                    <span>Granted</span>
                  </div>
                ) : (
                  <div className="text-muted-foreground flex items-center gap-1 text-sm">
                    <XCircle className="size-3.5" />
                    <span>Denied</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * Users Table
 * ──────────────────────────────────────────────────────────────────────── */

function statusVariant(status: 'active' | 'inactive' | 'pending') {
  switch (status) {
    case 'active':
      return 'default' as const;
    case 'inactive':
      return 'secondary' as const;
    case 'pending':
      return 'outline' as const;
  }
}

function roleVariant(role: string) {
  switch (role) {
    case 'admin':
      return 'default' as const;
    case 'editor':
      return 'secondary' as const;
    default:
      return 'outline' as const;
  }
}

function UsersTable() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Users className="text-primary size-4" />
        <div>
          <CardTitle className="text-sm">Users</CardTitle>
          <CardDescription>Manage team members and their roles.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_USERS.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      {u.image && <AvatarImage src={u.image} alt={u.name} />}
                      <AvatarFallback className="text-xs">{getInitials(u.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">{u.name}</p>
                      <p className="text-muted-foreground text-xs">{u.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={roleVariant(u.role)}>{u.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant(u.status)}>{u.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * RoleGate Examples Card
 * ──────────────────────────────────────────────────────────────────────── */

function RoleGateExamples() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Shield className="text-primary size-4" />
        <div>
          <CardTitle className="text-sm">RoleGate Examples</CardTitle>
          <CardDescription>
            Nested role gates showing/hiding sections based on permissions.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate
          role="admin"
          fallback={
            <div className="rounded-md border border-dashed p-3 text-center">
              <p className="text-muted-foreground text-sm">
                Admin-only section hidden (requires <code className="font-mono">admin</code> role)
              </p>
            </div>
          }
        >
          <div className="bg-primary/5 rounded-md border p-3">
            <p className="text-sm font-medium">Admin Section</p>
            <p className="text-muted-foreground text-xs">
              Visible because you have the <code className="font-mono">admin</code> role.
            </p>
          </div>
        </RoleGate>

        <RoleGate
          role="editor"
          fallback={
            <div className="rounded-md border border-dashed p-3 text-center">
              <p className="text-muted-foreground text-sm">
                Editor-only section hidden (requires <code className="font-mono">editor</code> role)
              </p>
            </div>
          }
        >
          <div className="bg-primary/5 rounded-md border p-3">
            <p className="text-sm font-medium">Editor Section</p>
            <p className="text-muted-foreground text-xs">
              Visible because you have the <code className="font-mono">editor</code> role.
            </p>
          </div>
        </RoleGate>

        <RoleGate
          role="billing"
          fallback={
            <div className="rounded-md border border-dashed p-3 text-center">
              <p className="text-muted-foreground text-sm">
                Billing-only section hidden (requires <code className="font-mono">billing</code>{' '}
                role)
              </p>
            </div>
          }
        >
          <div className="bg-primary/5 rounded-md border p-3">
            <p className="text-sm font-medium">Billing Section</p>
            <p className="text-muted-foreground text-xs">
              Visible because you have the <code className="font-mono">billing</code> role.
            </p>
          </div>
        </RoleGate>

        <Separator />

        <RoleGate
          role={['admin', 'editor']}
          fallback={
            <div className="rounded-md border border-dashed p-3 text-center">
              <p className="text-muted-foreground text-sm">
                Combined gate hidden (requires both{' '}
                <code className="font-mono">admin + editor</code>)
              </p>
            </div>
          }
        >
          <div className="bg-primary/5 rounded-md border p-3">
            <p className="text-sm font-medium">Admin + Editor Section</p>
            <p className="text-muted-foreground text-xs">
              Visible because you have both <code className="font-mono">admin</code> and{' '}
              <code className="font-mono">editor</code> roles.
            </p>
          </div>
        </RoleGate>
      </CardContent>
    </Card>
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * Page
 * ──────────────────────────────────────────────────────────────────────── */

export default function AdminPage() {
  return (
    <ContentContainer>
      <PageHeader
        title="Administration"
        description="Auth showcase — guards, roles, permissions, and user management."
        actions={
          <RoleGate role="admin">
            <Badge variant="outline" className="gap-1">
              <Shield className="size-3" />
              Admin Access
            </Badge>
          </RoleGate>
        }
      />

      {/* Unauthenticated users see an EmptyState */}
      <SignedOut>
        <EmptyState
          title="Sign in required"
          description="You must be signed in to access the administration panel."
          action={
            <Button variant="outline" size="sm">
              Sign in
            </Button>
          }
        />
      </SignedOut>

      {/* Authenticated but not admin: ErrorState */}
      <SignedIn>
        <RoleGate
          role="admin"
          fallback={
            <ErrorState
              title="Insufficient permissions"
              description="You need the admin role to view this section. Contact your administrator to request access."
            />
          }
        >
          {/* Full admin panel */}
          <div className="space-y-6">
            {/* Top summary cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <UserInfoCard />
              <SessionStatusCard />
              <PermissionCheckerCard />
            </div>

            <Separator />

            {/* Users table */}
            <UsersTable />

            <Separator />

            {/* RoleGate showcase */}
            <RoleGateExamples />
          </div>
        </RoleGate>
      </SignedIn>
    </ContentContainer>
  );
}
