'use client';

import { CopyIcon, CheckIcon } from 'lucide-react';

import { PageHeader } from '@jonmatum/next-shell/layout';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from '@jonmatum/next-shell/primitives';
import { ThemeToggleDropdown } from '@jonmatum/next-shell/providers';
import { useUser } from '@jonmatum/next-shell/auth';
import { useCopyToClipboard } from '@jonmatum/next-shell/hooks';

/* ────────────────────────────────────────────────────────────────────────
 * Settings page
 * ──────────────────────────────────────────────────────────────────────── */

const MOCK_API_KEY = 'tf_live_sk_a1b2c3d4e5f6g7h8i9j0klmnopqrstuv';

export default function SettingsPage() {
  const user = useUser();
  const { isCopied, copy } = useCopyToClipboard();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Settings" description="Manage your account settings and preferences." />

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        {/* ── Profile tab ─────────────────────────────────────────── */}
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="settings-name">Full Name</Label>
                  <Input
                    id="settings-name"
                    defaultValue={user?.name ?? ''}
                    placeholder="Your name"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="settings-email">Email</Label>
                  <Input
                    id="settings-email"
                    type="email"
                    defaultValue={user?.email ?? ''}
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="settings-bio">Bio</Label>
                <Textarea
                  id="settings-bio"
                  placeholder="Tell us a bit about yourself..."
                  rows={4}
                  defaultValue="Project manager and team lead with a passion for building great products."
                />
              </div>

              <Separator />

              {/* ── API key ─────────────────────────────────────────── */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="api-key">API Key</Label>
                <div className="flex items-center gap-2">
                  <Input id="api-key" readOnly value={MOCK_API_KEY} className="font-mono text-sm" />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copy(MOCK_API_KEY)}
                    aria-label={isCopied ? 'Copied' : 'Copy API key'}
                  >
                    {isCopied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
                  </Button>
                </div>
                <p className="text-muted-foreground text-xs">
                  Use this key to authenticate API requests. Keep it secret.
                </p>
              </div>

              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Notifications tab ───────────────────────────────────── */}
        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="notif-email" className="text-sm font-medium">
                    Email Notifications
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Receive email updates about project activity.
                  </p>
                </div>
                <Switch id="notif-email" defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="notif-push" className="text-sm font-medium">
                    Push Notifications
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Get real-time push notifications in your browser.
                  </p>
                </div>
                <Switch id="notif-push" defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="notif-digest" className="text-sm font-medium">
                    Weekly Digest
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Receive a weekly summary of all project updates.
                  </p>
                </div>
                <Switch id="notif-digest" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Appearance tab ──────────────────────────────────────── */}
        <TabsContent value="appearance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-foreground text-sm font-medium">Theme</span>
                  <p className="text-muted-foreground text-xs">
                    Choose between light, dark, or system theme.
                  </p>
                </div>
                <ThemeToggleDropdown />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="density" className="text-sm font-medium">
                    Density
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Adjust the visual density of the interface.
                  </p>
                </div>
                <Select defaultValue="comfortable">
                  <SelectTrigger id="density" className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="comfortable">Comfortable</SelectItem>
                    <SelectItem value="spacious">Spacious</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
