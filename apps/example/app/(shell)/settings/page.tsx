'use client';

import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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
  Checkbox,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge,
} from '@jonmatum/next-shell/primitives';
import { ThemeToggleDropdown } from '@jonmatum/next-shell/providers';
import { useUser } from '@jonmatum/next-shell/auth';
import { User, Bell, Shield, Palette } from 'lucide-react';

/* ────────────────────────────────────────────────────────────────────────
 * Types
 * ──────────────────────────────────────────────────────────────────────── */

interface ProfileForm {
  name: string;
  email: string;
  bio: string;
}

/* ────────────────────────────────────────────────────────────────────────
 * Profile Section
 * ──────────────────────────────────────────────────────────────────────── */

function ProfileSection() {
  const user = useUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      bio: 'Product designer and developer based in San Francisco.',
    },
  });

  function onSubmit(data: ProfileForm) {
    toast.promise(new Promise((r) => setTimeout(r, 1200)), {
      loading: 'Saving profile...',
      success: `Profile updated for ${data.name}`,
      error: 'Failed to save.',
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Update your personal information and public profile.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Display name</Label>
              <Input
                id="name"
                placeholder="Your display name"
                {...register('name', {
                  required: 'Display name is required',
                  minLength: { value: 2, message: 'Must be at least 2 characters' },
                })}
              />
              {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' },
                })}
              />
              {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Select defaultValue="admin">
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-sm">
              This controls your access level across the platform.
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              rows={3}
              {...register('bio', {
                maxLength: { value: 300, message: 'Bio must be under 300 characters' },
              })}
            />
            {errors.bio && <p className="text-destructive text-sm">{errors.bio.message}</p>}
            <p className="text-muted-foreground text-sm">
              Brief description for your profile. Max 300 characters.
            </p>
          </div>

          <div className="flex justify-end">
            <Button type="submit" size="sm">
              Save changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * Notifications Section
 * ──────────────────────────────────────────────────────────────────────── */

function NotificationsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Choose how and when you want to be notified.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email notifications</Label>
                <p className="text-muted-foreground text-sm">
                  Receive email updates about your account activity.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push notifications</Label>
                <p className="text-muted-foreground text-sm">
                  Get notified in your browser when something happens.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Label>Security alerts</Label>
                  <Badge variant="secondary" className="text-xs">
                    Recommended
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm">
                  Critical alerts about your account security.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="space-y-3">
              <Label className="text-base">Communication preferences</Label>
              <div className="flex items-start gap-2">
                <Checkbox id="marketing" />
                <div className="grid gap-0.5 leading-none">
                  <Label htmlFor="marketing" className="font-normal">
                    Marketing emails
                  </Label>
                  <p className="text-muted-foreground text-sm">
                    Receive emails about new features and product updates.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Checkbox id="digest" defaultChecked />
                <div className="grid gap-0.5 leading-none">
                  <Label htmlFor="digest" className="font-normal">
                    Weekly digest
                  </Label>
                  <p className="text-muted-foreground text-sm">
                    Get a weekly summary of your account activity.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={() =>
                toast.promise(new Promise((r) => setTimeout(r, 800)), {
                  loading: 'Updating preferences...',
                  success: 'Notification preferences saved',
                  error: 'Failed to update.',
                })
              }
            >
              Save preferences
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * Appearance Section
 * ──────────────────────────────────────────────────────────────────────── */

function AppearanceSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
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
            <Label>Sidebar position</Label>
            <p className="text-muted-foreground text-sm">
              Choose where the navigation sidebar appears.
            </p>
          </div>
          <Select defaultValue="left">
            <SelectTrigger className="w-32">
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
            <Label>Compact mode</Label>
            <p className="text-muted-foreground text-sm">
              Reduce spacing and padding for a denser layout.
            </p>
          </div>
          <Switch />
        </div>
      </CardContent>
    </Card>
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
        description="Manage your profile, notifications, and preferences."
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
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your password and two-factor authentication.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Password</Label>
                  <p className="text-muted-foreground text-sm">Last changed 30 days ago.</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.info('Password change dialog would open here.')}
                >
                  Change password
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Label>Two-factor authentication</Label>
                    <Badge variant="outline" className="text-xs">
                      Off
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Add an extra layer of security to your account.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.info('2FA setup wizard would open here.')}
                >
                  Enable
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Active sessions</Label>
                  <p className="text-muted-foreground text-sm">
                    You are currently signed in on 1 device.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.warning('This would sign out all other sessions.')}
                >
                  Sign out all
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ContentContainer>
  );
}
