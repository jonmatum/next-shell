'use client';

import * as React from 'react';
import { ContentContainer, PageHeader } from '@jonmatum/next-shell/layout';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@jonmatum/next-shell/primitives';
import { ThemeToggleDropdown } from '@jonmatum/next-shell/providers';
import { useDisclosure, useCopyToClipboard, useLocalStorage } from '@jonmatum/next-shell/hooks';
import {
  User,
  Bell,
  Shield,
  Palette,
  Upload,
  Copy,
  Check,
  Trash2,
  Monitor,
  Smartphone,
  Tablet,
} from 'lucide-react';

/* ────────────────────────────────────────────────────────────────────────
 * Profile Tab
 * ──────────────────────────────────────────────────────────────────────── */

function ProfileSection() {
  const [name, setName] = useLocalStorage('settings-name', 'Jane Doe');
  const [email, setEmail] = useLocalStorage('settings-email', 'jane@example.com');
  const [bio, setBio] = useLocalStorage(
    'settings-bio',
    'Product designer and developer based in San Francisco.',
  );
  const [website, setWebsite] = useLocalStorage('settings-website', 'https://example.com');

  return (
    <div className="space-y-6">
      {/* Avatar upload area */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Photo</CardTitle>
          <CardDescription>Upload a photo to personalize your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <Avatar className="size-20">
              <AvatarImage src={undefined} alt="Profile photo" />
              <AvatarFallback className="text-lg">
                {name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="size-3.5" />
                Upload photo
              </Button>
              <p className="text-muted-foreground text-xs">JPG, PNG, or GIF. Max 2 MB.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile form fields */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your name, email, and public profile details.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="profile-name">Name</Label>
                <Input
                  id="profile-name"
                  placeholder="Your display name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="profile-email">Email</Label>
                <Input
                  id="profile-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="profile-bio">Bio</Label>
              <Textarea
                id="profile-bio"
                placeholder="Tell us about yourself..."
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <p className="text-muted-foreground text-sm">
                Brief description for your profile. Max 300 characters.
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="profile-website">Website</Label>
              <Input
                id="profile-website"
                type="url"
                placeholder="https://example.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm">
                Cancel
              </Button>
              <Button size="sm">Save changes</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * Notifications Tab
 * ──────────────────────────────────────────────────────────────────────── */

function NotificationToggle({
  label,
  description,
  defaultChecked = false,
}: {
  label: string;
  description: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label>{label}</Label>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}

function NotificationsSection() {
  return (
    <div className="space-y-6">
      {/* Email notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>Choose which emails you want to receive.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NotificationToggle
            label="New messages"
            description="Receive an email when someone sends you a direct message."
            defaultChecked
          />
          <Separator />
          <NotificationToggle
            label="Task updates"
            description="Get notified when tasks you follow are updated or completed."
            defaultChecked
          />
          <Separator />
          <NotificationToggle
            label="Weekly digest"
            description="A summary of your account activity sent every Monday."
          />
        </CardContent>
      </Card>

      {/* Push notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>Configure browser and mobile push notifications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NotificationToggle
            label="Mentions"
            description="Get notified when someone mentions you in a comment or discussion."
            defaultChecked
          />
          <Separator />
          <NotificationToggle
            label="Deadlines"
            description="Receive reminders before upcoming task deadlines."
            defaultChecked
          />
          <Separator />
          <NotificationToggle
            label="Announcements"
            description="Important system-wide announcements and updates."
          />
        </CardContent>
      </Card>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * Appearance Tab
 * ──────────────────────────────────────────────────────────────────────── */

function AppearanceSection() {
  const [density, setDensity] = useLocalStorage('settings-density', 'comfortable');
  const [sidebarPosition, setSidebarPosition] = useLocalStorage(
    'settings-sidebar-position',
    'left',
  );
  const [reduceAnimations, setReduceAnimations] = useLocalStorage(
    'settings-reduce-animations',
    false,
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Customize the look and feel of the application.</CardDescription>
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
              <Label>Density</Label>
              <p className="text-muted-foreground text-sm">Control the spacing of UI elements.</p>
            </div>
            <Select value={density} onValueChange={setDensity}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="comfortable">Comfortable</SelectItem>
                <SelectItem value="spacious">Spacious</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Sidebar position</Label>
              <p className="text-muted-foreground text-sm">
                Choose where the navigation sidebar appears.
              </p>
            </div>
            <Select value={sidebarPosition} onValueChange={setSidebarPosition}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reduce-animations">Reduce animations</Label>
              <p className="text-muted-foreground text-sm">
                Minimize motion for accessibility or preference.
              </p>
            </div>
            <Checkbox
              id="reduce-animations"
              checked={reduceAnimations}
              onCheckedChange={(checked) => setReduceAnimations(checked === true)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Theme preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>See how your current settings look.</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="bg-muted/50 space-y-3 rounded-lg border p-4"
            data-density={density}
            data-sidebar={sidebarPosition}
          >
            <div className="flex items-center gap-3">
              <div className="bg-primary size-8 rounded-md" />
              <div className="space-y-1">
                <div className="bg-foreground/80 h-3 w-32 rounded" />
                <div className="bg-muted-foreground/40 h-2 w-48 rounded" />
              </div>
            </div>
            <div className="flex gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
            <div className="flex gap-2">
              <Button size="sm">Primary</Button>
              <Button size="sm" variant="outline">
                Outline
              </Button>
              <Button size="sm" variant="ghost">
                Ghost
              </Button>
            </div>
            <p className="text-muted-foreground text-xs">
              Density: {density} | Sidebar: {sidebarPosition} | Animations:{' '}
              {reduceAnimations ? 'reduced' : 'normal'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * Security Tab
 * ──────────────────────────────────────────────────────────────────────── */

const MOCK_API_KEY = 'nxsh_live_4f8a2b1c9d3e7f0a5b6c8d9e2f4a7b3c';

const MOCK_SESSIONS = [
  {
    id: '1',
    device: 'Chrome on macOS',
    icon: Monitor,
    location: 'San Francisco, CA',
    lastActive: '2 minutes ago',
    current: true,
  },
  {
    id: '2',
    device: 'Safari on iPhone',
    icon: Smartphone,
    location: 'San Francisco, CA',
    lastActive: '1 hour ago',
    current: false,
  },
  {
    id: '3',
    device: 'Firefox on iPad',
    icon: Tablet,
    location: 'New York, NY',
    lastActive: '3 days ago',
    current: false,
  },
];

function SecuritySection() {
  const { isCopied, copy } = useCopyToClipboard();
  const deleteDialog = useDisclosure();
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  return (
    <div className="space-y-6">
      {/* API Key */}
      <Card>
        <CardHeader>
          <CardTitle>API Key</CardTitle>
          <CardDescription>Use this key to authenticate API requests.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input value={MOCK_API_KEY} readOnly className="font-mono text-sm" />
            <Button
              variant="outline"
              size="icon"
              className="shrink-0"
              onClick={() => copy(MOCK_API_KEY)}
              aria-label={isCopied ? 'Copied' : 'Copy API key'}
            >
              {isCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
            </Button>
          </div>
          <p className="text-muted-foreground mt-2 text-xs">
            Keep this key secret. Do not share it in client-side code.
          </p>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password to keep your account secure.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="current-password">Current password</Label>
              <Input
                id="current-password"
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm new password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button size="sm">Update password</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>Devices currently signed in to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {MOCK_SESSIONS.map((session) => {
              const Icon = session.icon;
              return (
                <div key={session.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted flex size-9 items-center justify-center rounded-md">
                      <Icon className="text-muted-foreground size-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{session.device}</p>
                        {session.current && (
                          <Badge variant="secondary" className="text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-xs">
                        {session.location} &middot; {session.lastActive}
                      </p>
                    </div>
                  </div>
                  {!session.current && (
                    <Button variant="ghost" size="sm">
                      Revoke
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Delete Account */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Delete Account</CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog open={deleteDialog.isOpen} onOpenChange={deleteDialog.onOpenChange}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="gap-2">
                <Trash2 className="size-3.5" />
                Delete account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove
                  all your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={deleteDialog.close}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Yes, delete my account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * Page
 * ──────────────────────────────────────────────────────────────────────── */

export default function SettingsPage() {
  return (
    <ContentContainer size="sm">
      <PageHeader
        title="Settings"
        description="Manage your profile, notifications, appearance, and security."
      />

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="size-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="size-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="size-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="size-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSection />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsSection />
        </TabsContent>

        <TabsContent value="appearance">
          <AppearanceSection />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySection />
        </TabsContent>
      </Tabs>
    </ContentContainer>
  );
}
