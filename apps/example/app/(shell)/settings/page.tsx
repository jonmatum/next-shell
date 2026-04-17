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
} from '@jonmatum/next-shell/primitives';
import { ThemeToggleDropdown } from '@jonmatum/next-shell/providers';
import { useUser } from '@jonmatum/next-shell/auth';

interface ProfileForm {
  name: string;
  email: string;
}

export default function SettingsPage() {
  const user = useUser();
  const { register, handleSubmit } = useForm<ProfileForm>({
    defaultValues: { name: user?.name ?? '', email: user?.email ?? '' },
  });

  function onSubmit(data: ProfileForm) {
    toast.promise(new Promise((r) => setTimeout(r, 1200)), {
      loading: 'Saving profile…',
      success: `Profile updated for ${data.name}`,
      error: 'Failed to save.',
    });
  }

  return (
    <ContentContainer size="sm">
      <PageHeader title="Settings" description="Manage your profile and preferences." />

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your display name and email address.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Display name</Label>
              <Input id="name" {...register('name')} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email')} />
            </div>
            <div className="flex justify-end">
              <Button type="submit" size="sm">
                Save changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Toggle between light, dark, and system theme.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <span className="text-sm">Color scheme</span>
          <ThemeToggleDropdown />
        </CardContent>
      </Card>
    </ContentContainer>
  );
}
