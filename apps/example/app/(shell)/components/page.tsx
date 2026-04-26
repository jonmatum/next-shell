'use client';

import { ContentContainer, PageHeader } from '@jonmatum/next-shell/layout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  Input,
  Label,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@jonmatum/next-shell/primitives';
import {
  AlertCircle,
  ChevronDown,
  Copy,
  Edit,
  HelpCircle,
  Info,
  LogOut,
  Mail,
  MessageSquare,
  MoreHorizontal,
  PanelRight,
  Plus,
  Settings,
  Trash2,
  User,
} from 'lucide-react';

/* ────────────────────────────────────────────────────────────────────────
 * FAQ data for the Accordion
 * ──────────────────────────────────────────────────────────────────────── */

const faqItems = [
  {
    question: 'What is next-shell?',
    answer:
      'next-shell is a Next.js + shadcn/ui app shell and design-system extraction. It provides layout primitives, theme management, authentication scaffolding, and 40+ vendored shadcn/ui components.',
  },
  {
    question: 'How does the token system work?',
    answer:
      'All colors flow through semantic CSS custom properties declared in tokens.css. Components reference these tokens instead of raw color values, enabling consistent theming and dark mode support.',
  },
  {
    question: 'Can I customize the theme?',
    answer:
      'Yes. Override the CSS variables in your own stylesheet or use the ThemeProvider to switch between light and dark modes. The preset.css file maps tokens to Tailwind v4 @theme values.',
  },
  {
    question: 'Is server-side rendering supported?',
    answer:
      'Absolutely. Server-safe helpers live under /server subpaths (e.g. providers/server). Client components are explicitly marked with "use client" directives.',
  },
];

/* ────────────────────────────────────────────────────────────────────────
 * Page
 * ──────────────────────────────────────────────────────────────────────── */

export default function ComponentsPage() {
  return (
    <ContentContainer>
      <PageHeader
        title="Components"
        description="Interactive demos of primitives from @jonmatum/next-shell/primitives."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── Dialog ───────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dialog</CardTitle>
            <CardDescription>Modal dialog with a form-like layout</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <MessageSquare className="size-4" />
                  Open Dialog
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Share feedback</DialogTitle>
                  <DialogDescription>
                    Let us know how we can improve the experience.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="feedback-name">Name</Label>
                    <Input id="feedback-name" placeholder="Your name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="feedback-message">Message</Label>
                    <Input id="feedback-message" placeholder="What's on your mind?" />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button>Submit</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* ── Sheet ────────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sheet</CardTitle>
            <CardDescription>Slide-out side panel for secondary content</CardDescription>
          </CardHeader>
          <CardContent>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <PanelRight className="size-4" />
                  Open Sheet
                </Button>
              </SheetTrigger>
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
                  <SheetClose asChild>
                    <Button>Save</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </CardContent>
        </Card>

        {/* ── DropdownMenu ─────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dropdown Menu</CardTitle>
            <CardDescription>Context-style actions menu with keyboard shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <MoreHorizontal className="size-4" />
                  Actions
                  <ChevronDown className="size-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" align="start">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Edit className="size-4" />
                    Edit
                    <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy className="size-4" />
                    Duplicate
                    <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User className="size-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Mail className="size-4" />
                    Email
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="size-4" />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="size-4" />
                  Sign out
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>

        {/* ── Tooltip ──────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tooltip</CardTitle>
            <CardDescription>Informational hover hints for icon buttons</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" aria-label="Help">
                    <HelpCircle className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View documentation</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" aria-label="Add item">
                    <Plus className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Create a new item</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" aria-label="Delete">
                    <Trash2 className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Delete selected items</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardContent>
        </Card>

        {/* ── Accordion ────────────────────────────────────────────── */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Accordion</CardTitle>
            <CardDescription>Collapsible FAQ section</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* ── Alert variants ───────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Alert &mdash; Default</CardTitle>
            <CardDescription>Informational banner</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <Info className="size-4" />
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                You can add components to your app using the CLI or by copying from the registry.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Alert &mdash; Destructive</CardTitle>
            <CardDescription>Error or warning banner</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription>
                Your session has expired. Please sign in again to continue.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </ContentContainer>
  );
}
