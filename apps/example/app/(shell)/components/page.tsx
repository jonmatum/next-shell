'use client';

import { useState } from 'react';
import { ContentContainer, PageHeader } from '@jonmatum/next-shell/layout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Skeleton,
  Slider,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@jonmatum/next-shell/primitives';
import { useDisclosure } from '@jonmatum/next-shell/hooks';
import {
  AlertCircle,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Copy,
  Edit,
  HelpCircle,
  Info,
  Italic,
  LogOut,
  Mail,
  MoreHorizontal,
  PanelRight,
  Plus,
  Search,
  Settings,
  Trash2,
  Underline,
  User,
} from 'lucide-react';

/* ────────────────────────────────────────────────────────────────────────
 * Page
 * ──────────────────────────────────────────────────────────────────────── */

export default function ComponentsPage() {
  const dialog = useDisclosure();
  const sheet = useDisclosure();
  const [sliderValue, setSliderValue] = useState([40]);
  const [progressValue, setProgressValue] = useState(65);
  const [switchChecked, setSwitchChecked] = useState(true);
  const [checkboxChecked, setCheckboxChecked] = useState<boolean | 'indeterminate'>(true);

  return (
    <ContentContainer>
      <PageHeader
        title="Components"
        description="Interactive showcase of all available primitives."
      />

      <div className="space-y-10">
        {/* ════════════════════════════════════════════════════════════════
         * ACTIONS
         * ════════════════════════════════════════════════════════════════ */}
        <section>
          <h2 className="text-foreground mb-4 text-xl font-semibold tracking-tight">Actions</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* ── Button variants ─────────────────────────────────────── */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Button</CardTitle>
                <CardDescription>All 6 variants and 4 sizes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="default">Default</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
                <Separator />
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon" aria-label="Add">
                    <Plus className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* ── Toggle + ToggleGroup ────────────────────────────────── */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Toggle &amp; ToggleGroup</CardTitle>
                <CardDescription>Single toggle and grouped toggles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Toggle aria-label="Toggle bold">
                    <Bold className="size-4" />
                  </Toggle>
                  <Toggle aria-label="Toggle italic">
                    <Italic className="size-4" />
                  </Toggle>
                  <Toggle aria-label="Toggle underline">
                    <Underline className="size-4" />
                  </Toggle>
                </div>
                <Separator />
                <div>
                  <p className="text-muted-foreground mb-2 text-sm">Text alignment</p>
                  <ToggleGroup type="single" defaultValue="left">
                    <ToggleGroupItem value="left" aria-label="Align left">
                      <AlignLeft className="size-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="center" aria-label="Align center">
                      <AlignCenter className="size-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="right" aria-label="Align right">
                      <AlignRight className="size-4" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
         * FORM CONTROLS
         * ════════════════════════════════════════════════════════════════ */}
        <section>
          <h2 className="text-foreground mb-4 text-xl font-semibold tracking-tight">
            Form Controls
          </h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* ── Input ───────────────────────────────────────────────── */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Input</CardTitle>
                <CardDescription>Text, email, and search with icon</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="demo-text">Full name</Label>
                  <Input id="demo-text" type="text" placeholder="John Doe" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="demo-email">Email</Label>
                  <Input id="demo-email" type="email" placeholder="you@example.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="demo-search">Search</Label>
                  <div className="relative">
                    <Search className="text-muted-foreground absolute left-2.5 top-2.5 size-4" />
                    <Input id="demo-search" placeholder="Search..." className="pl-8" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ── Textarea + Select ───────────────────────────────────── */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Textarea &amp; Select</CardTitle>
                <CardDescription>Multi-line input and dropdown select</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="demo-textarea">Message</Label>
                  <Textarea id="demo-textarea" placeholder="Type your message here..." rows={3} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="demo-select">Framework</Label>
                  <Select>
                    <SelectTrigger id="demo-select">
                      <SelectValue placeholder="Select a framework" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="next">Next.js</SelectItem>
                      <SelectItem value="remix">Remix</SelectItem>
                      <SelectItem value="astro">Astro</SelectItem>
                      <SelectItem value="nuxt">Nuxt</SelectItem>
                      <SelectItem value="svelte">SvelteKit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* ── Checkbox + Switch ───────────────────────────────────── */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Checkbox &amp; Switch</CardTitle>
                <CardDescription>Boolean controls with labels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="demo-checkbox"
                    checked={checkboxChecked}
                    onCheckedChange={setCheckboxChecked}
                  />
                  <Label htmlFor="demo-checkbox">Accept terms and conditions</Label>
                </div>
                <Separator />
                <div className="flex items-center gap-2">
                  <Switch
                    id="demo-switch"
                    checked={switchChecked}
                    onCheckedChange={setSwitchChecked}
                  />
                  <Label htmlFor="demo-switch">
                    Email notifications {switchChecked ? '(on)' : '(off)'}
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* ── Slider + Label ──────────────────────────────────────── */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Slider</CardTitle>
                <CardDescription>Range input with live value display</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label>Volume</Label>
                    <span className="text-muted-foreground text-sm">{sliderValue[0]}%</span>
                  </div>
                  <Slider
                    value={sliderValue}
                    onValueChange={setSliderValue}
                    max={100}
                    step={1}
                    aria-label="Volume"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
         * FEEDBACK
         * ════════════════════════════════════════════════════════════════ */}
        <section>
          <h2 className="text-foreground mb-4 text-xl font-semibold tracking-tight">Feedback</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* ── Alert ───────────────────────────────────────────────── */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Alert</CardTitle>
                <CardDescription>Default and destructive variants</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Info className="size-4" />
                  <AlertTitle>Heads up!</AlertTitle>
                  <AlertDescription>
                    You can add components to your app using the CLI or by copying from the
                    registry.
                  </AlertDescription>
                </Alert>
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertTitle>Something went wrong</AlertTitle>
                  <AlertDescription>
                    Your session has expired. Please sign in again to continue.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* ── Badge ───────────────────────────────────────────────── */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Badge</CardTitle>
                <CardDescription>All 4 variants</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
              </CardContent>
            </Card>

            {/* ── Progress ────────────────────────────────────────────── */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Progress</CardTitle>
                <CardDescription>Animated progress bars at multiple values</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Upload progress</Label>
                    <span className="text-muted-foreground text-sm">{progressValue}%</span>
                  </div>
                  <Progress value={progressValue} aria-label="Upload progress" />
                </div>
                <div className="space-y-2">
                  <Label>Storage used</Label>
                  <Progress value={25} aria-label="Storage used" />
                </div>
                <div className="space-y-2">
                  <Label>Build complete</Label>
                  <Progress value={100} aria-label="Build complete" />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setProgressValue((v) => (v >= 100 ? 0 : v + 10))}
                >
                  Increment +10
                </Button>
              </CardContent>
            </Card>

            {/* ── Skeleton ────────────────────────────────────────────── */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Skeleton</CardTitle>
                <CardDescription>Loading placeholder pattern</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Skeleton className="size-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-32 w-full rounded-lg" />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
         * OVERLAYS
         * ════════════════════════════════════════════════════════════════ */}
        <section>
          <h2 className="text-foreground mb-4 text-xl font-semibold tracking-tight">Overlays</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* ── Dialog ──────────────────────────────────────────────── */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Dialog</CardTitle>
                <CardDescription>Modal dialog with useDisclosure</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={dialog.open}>
                  <Mail className="size-4" />
                  Open Dialog
                </Button>
                <Dialog open={dialog.isOpen} onOpenChange={dialog.onOpenChange}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Share feedback</DialogTitle>
                      <DialogDescription>
                        Let us know how we can improve the experience.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="dialog-name">Name</Label>
                        <Input id="dialog-name" placeholder="Your name" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="dialog-message">Message</Label>
                        <Textarea id="dialog-message" placeholder="What's on your mind?" />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button onClick={dialog.close}>Submit</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* ── Sheet ───────────────────────────────────────────────── */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Sheet</CardTitle>
                <CardDescription>Side panel with useDisclosure</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={sheet.open}>
                  <PanelRight className="size-4" />
                  Open Sheet
                </Button>
                <Sheet open={sheet.isOpen} onOpenChange={sheet.onOpenChange}>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Preferences</SheetTitle>
                      <SheetDescription>
                        Adjust your notification and display settings.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-6">
                      <div className="grid gap-2">
                        <Label htmlFor="sheet-email">Email</Label>
                        <Input id="sheet-email" placeholder="you@example.com" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="sheet-display">Display name</Label>
                        <Input id="sheet-display" placeholder="Display name" />
                      </div>
                    </div>
                    <SheetFooter>
                      <SheetClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </SheetClose>
                      <Button onClick={sheet.close}>Save</Button>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </CardContent>
            </Card>

            {/* ── AlertDialog ─────────────────────────────────────────── */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">AlertDialog</CardTitle>
                <CardDescription>Confirmation pattern with cancel / continue</CardDescription>
              </CardHeader>
              <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="size-4" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account and
                        remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Yes, delete account</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>

            {/* ── DropdownMenu + Tooltip ──────────────────────────────── */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">DropdownMenu &amp; Tooltip</CardTitle>
                <CardDescription>Actions menu with icons and tooltip on buttons</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <MoreHorizontal className="size-4" />
                      Actions
                      <ChevronDown className="size-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48" align="start">
                    <DropdownMenuItem>
                      <Edit className="size-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="size-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Settings className="size-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <LogOut className="size-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" aria-label="Help">
                        <HelpCircle className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>View documentation</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" aria-label="Add item">
                        <Plus className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Create a new item</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" aria-label="Delete">
                        <Trash2 className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">Delete selected items</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardContent>
            </Card>

            {/* ── Popover ─────────────────────────────────────────────── */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Popover</CardTitle>
                <CardDescription>Floating panel with form content</CardDescription>
              </CardHeader>
              <CardContent>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      <Settings className="size-4" />
                      Open Popover
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">Dimensions</h4>
                        <p className="text-muted-foreground text-sm">
                          Set the dimensions for the layer.
                        </p>
                      </div>
                      <div className="grid gap-2">
                        <div className="grid grid-cols-3 items-center gap-4">
                          <Label htmlFor="pop-width">Width</Label>
                          <Input id="pop-width" defaultValue="100%" className="col-span-2 h-8" />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                          <Label htmlFor="pop-height">Height</Label>
                          <Input id="pop-height" defaultValue="25px" className="col-span-2 h-8" />
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
         * DATA DISPLAY
         * ════════════════════════════════════════════════════════════════ */}
        <section>
          <h2 className="text-foreground mb-4 text-xl font-semibold tracking-tight">
            Data Display
          </h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* ── Accordion ───────────────────────────────────────────── */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Accordion</CardTitle>
                <CardDescription>Collapsible FAQ section</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="faq-1">
                    <AccordionTrigger>What is next-shell?</AccordionTrigger>
                    <AccordionContent>
                      next-shell is a Next.js + shadcn/ui app shell and design-system extraction. It
                      provides layout primitives, theme management, authentication scaffolding, and
                      40+ vendored shadcn/ui components.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq-2">
                    <AccordionTrigger>How does the token system work?</AccordionTrigger>
                    <AccordionContent>
                      All colors flow through semantic CSS custom properties declared in tokens.css.
                      Components reference these tokens instead of raw color values, enabling
                      consistent theming and dark mode support.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq-3">
                    <AccordionTrigger>Can I customize the theme?</AccordionTrigger>
                    <AccordionContent>
                      Yes. Override the CSS variables in your own stylesheet or use the
                      ThemeProvider to switch between light and dark modes. The preset.css file maps
                      tokens to Tailwind v4 @theme values.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* ── Tabs ────────────────────────────────────────────────── */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tabs</CardTitle>
                <CardDescription>Tabbed content panels</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="mt-3">
                    <p className="text-muted-foreground text-sm">
                      Your project is performing well. Monthly active users grew 12% compared to
                      last quarter.
                    </p>
                  </TabsContent>
                  <TabsContent value="analytics" className="mt-3">
                    <p className="text-muted-foreground text-sm">
                      Page views increased by 8.2% this week. The most visited page remains the
                      dashboard.
                    </p>
                  </TabsContent>
                  <TabsContent value="reports" className="mt-3">
                    <p className="text-muted-foreground text-sm">
                      3 reports are scheduled for generation. The weekly summary will be available
                      Friday.
                    </p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* ── Avatar ──────────────────────────────────────────────── */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Avatar</CardTitle>
                <CardDescription>Image and fallback variants</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback>
                      <User className="size-4" />
                    </AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarImage src="https://github.com/vercel.png" alt="Vercel" />
                    <AvatarFallback>V</AvatarFallback>
                  </Avatar>
                </div>
              </CardContent>
            </Card>

            {/* ── Separator ───────────────────────────────────────────── */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Separator</CardTitle>
                <CardDescription>Horizontal and vertical separators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Horizontal</p>
                  <Separator className="my-2" />
                  <p className="text-muted-foreground text-sm">Content below the separator.</p>
                </div>
                <div className="flex h-5 items-center gap-4 text-sm">
                  <span>Blog</span>
                  <Separator orientation="vertical" />
                  <span>Docs</span>
                  <Separator orientation="vertical" />
                  <span>Source</span>
                  <Separator orientation="vertical" />
                  <span>API</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
         * NAVIGATION
         * ════════════════════════════════════════════════════════════════ */}
        <section>
          <h2 className="text-foreground mb-4 text-xl font-semibold tracking-tight">Navigation</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* ── Breadcrumb ──────────────────────────────────────────── */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Breadcrumb</CardTitle>
                <CardDescription>Manual breadcrumb navigation</CardDescription>
              </CardHeader>
              <CardContent>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/components">Components</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </ContentContainer>
  );
}
