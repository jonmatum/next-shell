'use client';

import { UserPlusIcon } from 'lucide-react';

import { PageHeader } from '@jonmatum/next-shell/layout';
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@jonmatum/next-shell/primitives';
import { RoleGate } from '@jonmatum/next-shell/auth';
import { useDisclosure } from '@jonmatum/next-shell/hooks';

/* ────────────────────────────────────────────────────────────────────────
 * Mock data
 * ──────────────────────────────────────────────────────────────────────── */

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'away' | 'offline';
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 't1',
    name: 'Sarah Chen',
    email: 'sarah@taskflow.dev',
    role: 'Project Manager',
    status: 'active',
  },
  {
    id: 't2',
    name: 'Marcus Rivera',
    email: 'marcus@taskflow.dev',
    role: 'Senior Developer',
    status: 'active',
  },
  {
    id: 't3',
    name: 'Priya Patel',
    email: 'priya@taskflow.dev',
    role: 'UX Designer',
    status: 'active',
  },
  {
    id: 't4',
    name: 'Alex Kim',
    email: 'alex@taskflow.dev',
    role: 'Frontend Developer',
    status: 'away',
  },
  {
    id: 't5',
    name: 'Jordan Lee',
    email: 'jordan@taskflow.dev',
    role: 'Backend Developer',
    status: 'active',
  },
  {
    id: 't6',
    name: 'Taylor Morgan',
    email: 'taylor@taskflow.dev',
    role: 'DevOps Engineer',
    status: 'offline',
  },
  {
    id: 't7',
    name: 'Riley Brooks',
    email: 'riley@taskflow.dev',
    role: 'QA Lead',
    status: 'active',
  },
  {
    id: 't8',
    name: 'Casey Nguyen',
    email: 'casey@taskflow.dev',
    role: 'Product Designer',
    status: 'away',
  },
];

const STATUS_BADGE_VARIANT: Record<TeamMember['status'], 'default' | 'secondary' | 'outline'> = {
  active: 'default',
  away: 'secondary',
  offline: 'outline',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

/* ────────────────────────────────────────────────────────────────────────
 * Team page
 * ──────────────────────────────────────────────────────────────────────── */

export default function TeamPage() {
  const inviteSheet = useDisclosure();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Team"
        description="Manage your team members and roles."
        actions={
          <RoleGate role="pm">
            <Button onClick={inviteSheet.open}>
              <UserPlusIcon className="size-4" />
              Invite Member
            </Button>
          </RoleGate>
        }
      />

      {/* ── Team member grid ───────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {TEAM_MEMBERS.map((member) => (
          <Card key={member.id}>
            <CardContent className="flex flex-col items-center gap-3 pt-6 text-center">
              <Avatar className="size-16">
                <AvatarFallback className="text-lg">{getInitials(member.name)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <h3 className="text-foreground text-sm font-semibold">{member.name}</h3>
                <p className="text-muted-foreground text-xs">{member.role}</p>
                <p className="text-muted-foreground text-xs">{member.email}</p>
              </div>
              <Badge variant={STATUS_BADGE_VARIANT[member.status]}>{member.status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Invite member sheet ────────────────────────────────────── */}
      <Sheet open={inviteSheet.isOpen} onOpenChange={inviteSheet.onOpenChange}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Invite Team Member</SheetTitle>
            <SheetDescription>Send an invitation to join your TaskFlow workspace.</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4 py-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="invite-name">Full Name</Label>
              <Input id="invite-name" placeholder="e.g. Jane Doe" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="invite-email">Email Address</Label>
              <Input id="invite-email" type="email" placeholder="jane@company.com" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="invite-role">Role</Label>
              <Select>
                <SelectTrigger id="invite-role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="designer">Designer</SelectItem>
                  <SelectItem value="pm">Project Manager</SelectItem>
                  <SelectItem value="qa">QA Engineer</SelectItem>
                  <SelectItem value="devops">DevOps Engineer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={inviteSheet.close}>
              Cancel
            </Button>
            <Button onClick={inviteSheet.close}>Send Invitation</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
