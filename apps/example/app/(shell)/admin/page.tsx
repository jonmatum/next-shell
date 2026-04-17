'use client';

import { ContentContainer, PageHeader, ErrorState } from '@jonmatum/next-shell/layout';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@jonmatum/next-shell/primitives';
import { SignedIn, SignedOut, RoleGate, useUser } from '@jonmatum/next-shell/auth';
import { Shield, Users, Key } from 'lucide-react';

export default function AdminPage() {
  const user = useUser();

  return (
    <ContentContainer>
      <PageHeader title="Admin Panel" description="Restricted to users with the admin role." />

      {/* SignedOut guard demo */}
      <SignedOut>
        <ErrorState title="Not authenticated" description="Sign in to access this page." />
      </SignedOut>

      {/* RoleGate: only admin sees the panel */}
      <SignedIn>
        <RoleGate
          role={['admin']}
          fallback={
            <ErrorState
              title="Access denied"
              description="You need the admin role to view this section."
            />
          }
        >
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Shield className="text-primary size-4" />
                <CardTitle className="text-sm">Role</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {(user?.roles ?? []).map((r) => (
                    <Badge key={r}>{r}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Users className="text-primary size-4" />
                <CardTitle className="text-sm">Session User</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-muted-foreground text-xs">{user?.email}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Key className="text-primary size-4" />
                <CardTitle className="text-sm">Auth Adapter</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="outline">mock adapter</Badge>
              </CardContent>
            </Card>
          </div>
        </RoleGate>
      </SignedIn>
    </ContentContainer>
  );
}
