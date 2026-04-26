'use client';

import { ContentContainer, PageHeader } from '@jonmatum/next-shell/layout';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Input,
  Label,
  Separator,
  Switch,
} from '@jonmatum/next-shell/primitives';
import { ThemeToggleDropdown } from '@jonmatum/next-shell/providers';
import { useUser } from '@jonmatum/next-shell/auth';

export default function SettingsPage() {
  const user = useUser();

  return (
    <ContentContainer size="sm">
      <PageHeader title="Settings" description="Manage your profile and preferences." />

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your personal information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue={user?.name ?? ''} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email ?? ''} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" size="sm">
                Save
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the look and feel.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Color scheme</Label>
              <p className="text-muted-foreground text-sm">
                Toggle between light, dark, and system theme.
              </p>
            </div>
            <ThemeToggleDropdown />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notifications</Label>
              <p className="text-muted-foreground text-sm">Receive email notifications.</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </ContentContainer>
  );
}
