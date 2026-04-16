import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as Primitives from '../src/primitives/index.js';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
  AspectRatio,
  Avatar,
  AvatarFallback,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Dialog,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuTrigger,
  Input,
  Label,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  Popover,
  PopoverTrigger,
  Progress,
  RadioGroup,
  RadioGroupItem,
  ScrollArea,
  Select,
  SelectTrigger,
  SelectValue,
  Separator,
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
  TooltipProvider,
  TooltipTrigger,
  buttonVariants,
} from '../src/primitives/index.js';

describe('Button', () => {
  it('renders with default variant + size and a data-slot marker', () => {
    render(<Button>Save</Button>);
    const btn = screen.getByRole('button', { name: 'Save' });
    expect(btn).toHaveAttribute('data-slot', 'button');
    expect(btn).toHaveAttribute('data-variant', 'default');
    expect(btn).toHaveAttribute('data-size', 'default');
  });

  it('applies variant + size class names via cva', () => {
    render(
      <Button variant="destructive" size="sm">
        Delete
      </Button>,
    );
    const btn = screen.getByRole('button', { name: 'Delete' });
    expect(btn.className).toMatch(/bg-destructive/);
    expect(btn.className).toMatch(/h-8/);
  });

  it('renders as a child slot when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/docs">Docs</a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveAttribute('href', '/docs');
    expect(link).toHaveAttribute('data-slot', 'button');
  });

  it('fires onClick handlers', async () => {
    const user = userEvent.setup();
    let count = 0;
    render(<Button onClick={() => count++}>Tap</Button>);
    await user.click(screen.getByRole('button', { name: 'Tap' }));
    expect(count).toBe(1);
  });

  it('exposes buttonVariants as a standalone cva function', () => {
    expect(typeof buttonVariants).toBe('function');
    const className = buttonVariants({ variant: 'outline', size: 'lg' });
    expect(className).toMatch(/border/);
    expect(className).toMatch(/h-10/);
  });

  it('uses the destructive-foreground semantic token (no raw white)', () => {
    render(<Button variant="destructive">X</Button>);
    const btn = screen.getByRole('button', { name: 'X' });
    expect(btn.className).toMatch(/text-destructive-foreground/);
    expect(btn.className).not.toMatch(/text-white\b/);
  });
});

describe('Input', () => {
  it('renders an input with a data-slot marker', () => {
    render(<Input placeholder="Name" />);
    const input = screen.getByPlaceholderText('Name');
    expect(input).toHaveAttribute('data-slot', 'input');
    expect(input.tagName).toBe('INPUT');
  });

  it('accepts typed input', async () => {
    const user = userEvent.setup();
    render(<Input aria-label="email" />);
    const input = screen.getByLabelText('email');
    await user.type(input, 'hi@next.sh');
    expect(input).toHaveValue('hi@next.sh');
  });
});

describe('Label', () => {
  it('renders a label element with a data-slot marker', () => {
    render(<Label htmlFor="email">Email</Label>);
    const label = screen.getByText('Email');
    expect(label).toHaveAttribute('data-slot', 'label');
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveAttribute('for', 'email');
  });
});

describe('Separator', () => {
  it('renders a horizontal separator by default', () => {
    render(<Separator data-testid="sep" />);
    const sep = screen.getByTestId('sep');
    expect(sep).toHaveAttribute('data-slot', 'separator');
    expect(sep).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('supports a vertical orientation', () => {
    render(<Separator data-testid="sep" orientation="vertical" />);
    expect(screen.getByTestId('sep')).toHaveAttribute('data-orientation', 'vertical');
  });
});

describe('Skeleton', () => {
  it('renders a pulsing placeholder div', () => {
    render(<Skeleton data-testid="sk" className="h-6 w-24" />);
    const el = screen.getByTestId('sk');
    expect(el).toHaveAttribute('data-slot', 'skeleton');
    expect(el.className).toMatch(/animate-pulse/);
    expect(el.className).toMatch(/bg-accent/);
    expect(el.className).toMatch(/h-6/);
  });
});

describe('Textarea', () => {
  it('renders a textarea with a data-slot marker', () => {
    render(<Textarea placeholder="Bio" />);
    const ta = screen.getByPlaceholderText('Bio');
    expect(ta).toHaveAttribute('data-slot', 'textarea');
    expect(ta.tagName).toBe('TEXTAREA');
  });

  it('accepts multi-line input', async () => {
    const user = userEvent.setup();
    render(<Textarea aria-label="bio" />);
    const ta = screen.getByLabelText('bio');
    await user.type(ta, 'line one{enter}line two');
    expect(ta).toHaveValue('line one\nline two');
  });
});

/* ────────────────────────────────────────────────────────────────────────
 * Overlays (3c): Tooltip, Dialog, Popover, DropdownMenu, ContextMenu,
 * HoverCard, AlertDialog, Sheet, Menubar, NavigationMenu, Drawer.
 *
 * Full interaction tests for Radix overlays belong in Storybook / Playwright
 * VR (Phase 9). These tests cover:
 *   - Export-surface completeness (every named export is defined)
 *   - Closed-state render (trigger + data-slot) for the four canonical
 *     overlay trigger flavors: Tooltip (wrapped in provider), Dialog,
 *     Popover, DropdownMenu.
 * ──────────────────────────────────────────────────────────────────────── */

describe('Primitives barrel — overlay + form exports', () => {
  // Enumerated so a typo or missing export fails loudly with the name.
  const expected = [
    // Alert dialog
    'AlertDialog',
    'AlertDialogAction',
    'AlertDialogCancel',
    'AlertDialogContent',
    'AlertDialogDescription',
    'AlertDialogFooter',
    'AlertDialogHeader',
    'AlertDialogMedia',
    'AlertDialogOverlay',
    'AlertDialogPortal',
    'AlertDialogTitle',
    'AlertDialogTrigger',
    // Context menu
    'ContextMenu',
    'ContextMenuCheckboxItem',
    'ContextMenuContent',
    'ContextMenuGroup',
    'ContextMenuItem',
    'ContextMenuLabel',
    'ContextMenuPortal',
    'ContextMenuRadioGroup',
    'ContextMenuRadioItem',
    'ContextMenuSeparator',
    'ContextMenuShortcut',
    'ContextMenuSub',
    'ContextMenuSubContent',
    'ContextMenuSubTrigger',
    'ContextMenuTrigger',
    // Dialog
    'Dialog',
    'DialogClose',
    'DialogContent',
    'DialogDescription',
    'DialogFooter',
    'DialogHeader',
    'DialogOverlay',
    'DialogPortal',
    'DialogTitle',
    'DialogTrigger',
    // Drawer
    'Drawer',
    'DrawerClose',
    'DrawerContent',
    'DrawerDescription',
    'DrawerFooter',
    'DrawerHeader',
    'DrawerOverlay',
    'DrawerPortal',
    'DrawerTitle',
    'DrawerTrigger',
    // Dropdown menu
    'DropdownMenu',
    'DropdownMenuCheckboxItem',
    'DropdownMenuContent',
    'DropdownMenuGroup',
    'DropdownMenuItem',
    'DropdownMenuLabel',
    'DropdownMenuPortal',
    'DropdownMenuRadioGroup',
    'DropdownMenuRadioItem',
    'DropdownMenuSeparator',
    'DropdownMenuShortcut',
    'DropdownMenuSub',
    'DropdownMenuSubContent',
    'DropdownMenuSubTrigger',
    'DropdownMenuTrigger',
    // Hover card
    'HoverCard',
    'HoverCardContent',
    'HoverCardTrigger',
    // Menubar
    'Menubar',
    'MenubarCheckboxItem',
    'MenubarContent',
    'MenubarGroup',
    'MenubarItem',
    'MenubarLabel',
    'MenubarMenu',
    'MenubarPortal',
    'MenubarRadioGroup',
    'MenubarRadioItem',
    'MenubarSeparator',
    'MenubarShortcut',
    'MenubarSub',
    'MenubarSubContent',
    'MenubarSubTrigger',
    'MenubarTrigger',
    // Navigation menu
    'NavigationMenu',
    'NavigationMenuContent',
    'NavigationMenuIndicator',
    'NavigationMenuItem',
    'NavigationMenuLink',
    'NavigationMenuList',
    'NavigationMenuTrigger',
    'NavigationMenuViewport',
    'navigationMenuTriggerStyle',
    // Popover
    'Popover',
    'PopoverAnchor',
    'PopoverContent',
    'PopoverDescription',
    'PopoverHeader',
    'PopoverTitle',
    'PopoverTrigger',
    // Sheet
    'Sheet',
    'SheetClose',
    'SheetContent',
    'SheetDescription',
    'SheetFooter',
    'SheetHeader',
    'SheetTitle',
    'SheetTrigger',
    // Tooltip
    'Tooltip',
    'TooltipContent',
    'TooltipProvider',
    'TooltipTrigger',
    // Form controls (3d)
    'Checkbox',
    'RadioGroup',
    'RadioGroupItem',
    'Select',
    'SelectContent',
    'SelectGroup',
    'SelectItem',
    'SelectLabel',
    'SelectScrollDownButton',
    'SelectScrollUpButton',
    'SelectSeparator',
    'SelectTrigger',
    'SelectValue',
    'Slider',
    'Switch',
    'Toggle',
    'toggleVariants',
    'ToggleGroup',
    'ToggleGroupItem',
    // Data primitives (3g3)
    'Carousel',
    'CarouselContent',
    'CarouselItem',
    'CarouselNext',
    'CarouselPrevious',
    'ChartContainer',
    'ChartLegend',
    'ChartLegendContent',
    'ChartStyle',
    'ChartTooltip',
    'ChartTooltipContent',
    'ResizableHandle',
    'ResizablePanel',
    'ResizablePanelGroup',
    // Form + date + OTP (3e)
    'Calendar',
    'CalendarDayButton',
    'Form',
    'FormControl',
    'FormDescription',
    'FormField',
    'FormItem',
    'FormLabel',
    'FormMessage',
    'useFormField',
    'InputOTP',
    'InputOTPGroup',
    'InputOTPSeparator',
    'InputOTPSlot',
    // cmdk / sonner / table (3g2)
    'Command',
    'CommandDialog',
    'CommandEmpty',
    'CommandGroup',
    'CommandInput',
    'CommandItem',
    'CommandList',
    'CommandSeparator',
    'CommandShortcut',
    'Table',
    'TableBody',
    'TableCaption',
    'TableCell',
    'TableFooter',
    'TableHead',
    'TableHeader',
    'TableRow',
    'Toaster',
    // Simple primitives (3g1)
    'Accordion',
    'AccordionContent',
    'AccordionItem',
    'AccordionTrigger',
    'Alert',
    'AlertDescription',
    'AlertTitle',
    'AspectRatio',
    'Avatar',
    'AvatarBadge',
    'AvatarFallback',
    'AvatarGroup',
    'AvatarGroupCount',
    'AvatarImage',
    'Badge',
    'badgeVariants',
    'Breadcrumb',
    'BreadcrumbEllipsis',
    'BreadcrumbItem',
    'BreadcrumbLink',
    'BreadcrumbList',
    'BreadcrumbPage',
    'BreadcrumbSeparator',
    'Card',
    'CardAction',
    'CardContent',
    'CardDescription',
    'CardFooter',
    'CardHeader',
    'CardTitle',
    'Collapsible',
    'CollapsibleContent',
    'CollapsibleTrigger',
    'Pagination',
    'PaginationContent',
    'PaginationEllipsis',
    'PaginationItem',
    'PaginationLink',
    'PaginationNext',
    'PaginationPrevious',
    'Progress',
    'ScrollArea',
    'ScrollBar',
    'Tabs',
    'TabsContent',
    'TabsList',
    'TabsTrigger',
    'tabsListVariants',
  ] as const;

  it.each(expected)('exports %s as a component or hook', (name) => {
    const value = (Primitives as Record<string, unknown>)[name];
    expect(value, `Primitives.${name} should be defined`).toBeDefined();
    // Components can be plain functions, memo()/forwardRef() objects,
    // cva functions, etc. Accept any function OR any non-null object.
    expect(['function', 'object']).toContain(typeof value);
    if (typeof value === 'object') {
      expect(value).not.toBeNull();
    }
  });
});

describe('Tooltip (closed render)', () => {
  it('renders a trigger with the tooltip-trigger data-slot', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
        </Tooltip>
      </TooltipProvider>,
    );
    const trigger = screen.getByText('Hover me');
    expect(trigger).toHaveAttribute('data-slot', 'tooltip-trigger');
  });
});

describe('Dialog (closed render)', () => {
  it('renders a trigger with the dialog-trigger data-slot', () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
      </Dialog>,
    );
    const trigger = screen.getByText('Open');
    expect(trigger).toHaveAttribute('data-slot', 'dialog-trigger');
  });
});

describe('Popover (closed render)', () => {
  it('renders a trigger with the popover-trigger data-slot', () => {
    render(
      <Popover>
        <PopoverTrigger>Show</PopoverTrigger>
      </Popover>,
    );
    const trigger = screen.getByText('Show');
    expect(trigger).toHaveAttribute('data-slot', 'popover-trigger');
  });
});

describe('DropdownMenu (closed render)', () => {
  it('renders a trigger with the dropdown-menu-trigger data-slot', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
      </DropdownMenu>,
    );
    const trigger = screen.getByText('Menu');
    expect(trigger).toHaveAttribute('data-slot', 'dropdown-menu-trigger');
  });
});

/* ────────────────────────────────────────────────────────────────────────
 * Form controls (3d): Checkbox, RadioGroup, Switch, Select, Slider,
 * Toggle, ToggleGroup. These are simpler than overlays — the root element
 * renders visibly without needing a trigger + portal, so we can do
 * render + interaction tests directly.
 * ──────────────────────────────────────────────────────────────────────── */

describe('Checkbox', () => {
  it('renders a role=checkbox with data-slot and toggles on click', async () => {
    const user = userEvent.setup();
    render(<Checkbox aria-label="terms" />);
    const cb = screen.getByRole('checkbox', { name: 'terms' });
    expect(cb).toHaveAttribute('data-slot', 'checkbox');
    expect(cb).toHaveAttribute('data-state', 'unchecked');
    await user.click(cb);
    expect(cb).toHaveAttribute('data-state', 'checked');
  });
});

describe('RadioGroup', () => {
  it('renders grouped radios and selects on click', async () => {
    const user = userEvent.setup();
    render(
      <RadioGroup defaultValue="a" aria-label="letters">
        <RadioGroupItem value="a" aria-label="option-a" />
        <RadioGroupItem value="b" aria-label="option-b" />
      </RadioGroup>,
    );
    const a = screen.getByRole('radio', { name: 'option-a' });
    const b = screen.getByRole('radio', { name: 'option-b' });
    expect(a).toHaveAttribute('data-slot', 'radio-group-item');
    expect(a).toHaveAttribute('data-state', 'checked');
    expect(b).toHaveAttribute('data-state', 'unchecked');
    await user.click(b);
    expect(a).toHaveAttribute('data-state', 'unchecked');
    expect(b).toHaveAttribute('data-state', 'checked');
  });
});

describe('Switch', () => {
  it('renders a role=switch with data-slot and toggles on click', async () => {
    const user = userEvent.setup();
    render(<Switch aria-label="notifications" />);
    const sw = screen.getByRole('switch', { name: 'notifications' });
    expect(sw).toHaveAttribute('data-slot', 'switch');
    expect(sw).toHaveAttribute('data-state', 'unchecked');
    await user.click(sw);
    expect(sw).toHaveAttribute('data-state', 'checked');
  });
});

describe('Select (closed render)', () => {
  it('renders a trigger with the select-trigger data-slot', () => {
    render(
      <Select>
        <SelectTrigger aria-label="theme">
          <SelectValue placeholder="Pick" />
        </SelectTrigger>
      </Select>,
    );
    const trigger = screen.getByRole('combobox', { name: 'theme' });
    expect(trigger).toHaveAttribute('data-slot', 'select-trigger');
  });
});

describe('Slider', () => {
  it('renders the root with data-slot and exposes slider semantics on the thumb', () => {
    const { container } = render(<Slider defaultValue={[25]} max={100} />);
    const root = container.querySelector('[data-slot="slider"]');
    expect(root).toBeTruthy();
    const thumb = screen.getByRole('slider');
    expect(thumb).toHaveAttribute('data-slot', 'slider-thumb');
    expect(thumb).toHaveAttribute('aria-valuenow', '25');
    expect(thumb).toHaveAttribute('aria-valuemax', '100');
  });
});

describe('Toggle', () => {
  it('renders a button with data-slot and flips pressed state on click', async () => {
    const user = userEvent.setup();
    render(<Toggle aria-label="bold">B</Toggle>);
    const btn = screen.getByRole('button', { name: 'bold' });
    expect(btn).toHaveAttribute('data-slot', 'toggle');
    expect(btn).toHaveAttribute('data-state', 'off');
    await user.click(btn);
    expect(btn).toHaveAttribute('data-state', 'on');
  });
});

describe('ToggleGroup', () => {
  it('renders a group and selects one item at a time in single mode', async () => {
    const user = userEvent.setup();
    render(
      <ToggleGroup type="single" aria-label="align">
        <ToggleGroupItem value="left" aria-label="align-left">
          L
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="align-right">
          R
        </ToggleGroupItem>
      </ToggleGroup>,
    );
    const left = screen.getByRole('radio', { name: 'align-left' });
    const right = screen.getByRole('radio', { name: 'align-right' });
    expect(left).toHaveAttribute('data-slot', 'toggle-group-item');
    await user.click(left);
    expect(left).toHaveAttribute('data-state', 'on');
    await user.click(right);
    expect(left).toHaveAttribute('data-state', 'off');
    expect(right).toHaveAttribute('data-state', 'on');
  });
});

/* ────────────────────────────────────────────────────────────────────────
 * Simple primitives (3g1): Accordion, Alert, AspectRatio, Avatar, Badge,
 * Breadcrumb, Card, Collapsible, Pagination, Progress, ScrollArea, Tabs.
 *
 * These render their full trees inline (no Radix portals), so we can do
 * render + interaction tests directly in JSDOM.
 * ──────────────────────────────────────────────────────────────────────── */

describe('Accordion', () => {
  it('renders closed items and opens the clicked one', async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="one">
          <AccordionTrigger>One</AccordionTrigger>
          <AccordionContent>First panel</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    const trigger = screen.getByRole('button', { name: 'One' });
    expect(trigger).toHaveAttribute('data-state', 'closed');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('data-state', 'open');
  });
});

describe('Alert', () => {
  it('renders with role=alert and data-slot', () => {
    render(
      <Alert>
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>Something happened.</AlertDescription>
      </Alert>,
    );
    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('data-slot', 'alert');
    expect(screen.getByText('Heads up!')).toHaveAttribute('data-slot', 'alert-title');
    expect(screen.getByText('Something happened.')).toHaveAttribute(
      'data-slot',
      'alert-description',
    );
  });
});

describe('AspectRatio', () => {
  it('renders a ratio wrapper with data-slot', () => {
    render(
      <AspectRatio ratio={16 / 9} data-testid="ar">
        <div>content</div>
      </AspectRatio>,
    );
    expect(screen.getByTestId('ar')).toHaveAttribute('data-slot', 'aspect-ratio');
  });
});

describe('Avatar', () => {
  it('renders a fallback when no image is set', () => {
    render(
      <Avatar>
        <AvatarFallback>JM</AvatarFallback>
      </Avatar>,
    );
    const fallback = screen.getByText('JM');
    expect(fallback).toHaveAttribute('data-slot', 'avatar-fallback');
  });
});

describe('Badge', () => {
  it('renders with data-slot and variant class', () => {
    render(<Badge variant="destructive">New</Badge>);
    const badge = screen.getByText('New');
    expect(badge).toHaveAttribute('data-slot', 'badge');
    expect(badge.className).toMatch(/bg-destructive/);
    expect(badge.className).toMatch(/text-destructive-foreground/);
    expect(badge.className).not.toMatch(/text-white\b/);
  });
});

describe('Breadcrumb', () => {
  it('renders as a navigation landmark with link children', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/home">Home</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('data-slot', 'breadcrumb');
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
      'data-slot',
      'breadcrumb-link',
    );
  });
});

describe('Card', () => {
  it('renders each sub-slot with its data-slot marker', () => {
    render(
      <Card data-testid="card">
        <CardHeader data-testid="hdr">
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent data-testid="body">body</CardContent>
      </Card>,
    );
    expect(screen.getByTestId('card')).toHaveAttribute('data-slot', 'card');
    expect(screen.getByTestId('hdr')).toHaveAttribute('data-slot', 'card-header');
    expect(screen.getByText('Title')).toHaveAttribute('data-slot', 'card-title');
    expect(screen.getByText('Description')).toHaveAttribute('data-slot', 'card-description');
    expect(screen.getByTestId('body')).toHaveAttribute('data-slot', 'card-content');
  });
});

describe('Collapsible', () => {
  it('opens content on trigger click', async () => {
    const user = userEvent.setup();
    render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Secret</CollapsibleContent>
      </Collapsible>,
    );
    const trigger = screen.getByRole('button', { name: 'Toggle' });
    expect(trigger).toHaveAttribute('data-state', 'closed');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('data-state', 'open');
  });
});

describe('Pagination', () => {
  it('renders as a navigation landmark with links', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#1" isActive>
              1
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    );
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('data-slot', 'pagination');
    const active = screen.getByRole('link', { name: /1/ });
    expect(active).toHaveAttribute('data-active', 'true');
  });
});

describe('Progress', () => {
  it('renders role=progressbar with data-slot and a progress-indicator child', () => {
    const { container } = render(<Progress value={42} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('data-slot', 'progress');
    const indicator = container.querySelector('[data-slot="progress-indicator"]') as HTMLElement;
    expect(indicator).toBeTruthy();
    // The indicator translates by -(100 - value)% to visualize progress.
    expect(indicator.style.transform).toBe('translateX(-58%)');
  });
});

describe('ScrollArea', () => {
  it('renders with data-slot and a scroll-area-viewport child', () => {
    const { container } = render(
      <ScrollArea data-testid="sa">
        <div style={{ width: 2000 }}>wide content</div>
      </ScrollArea>,
    );
    expect(screen.getByTestId('sa')).toHaveAttribute('data-slot', 'scroll-area');
    expect(container.querySelector('[data-slot="scroll-area-viewport"]')).toBeTruthy();
  });
});

describe('Tabs', () => {
  it('shows the default tab content and switches on trigger click', async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Panel A</TabsContent>
        <TabsContent value="b">Panel B</TabsContent>
      </Tabs>,
    );
    expect(screen.getByRole('tab', { name: 'A' })).toHaveAttribute('data-state', 'active');
    expect(screen.getByText('Panel A')).toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: 'B' }));
    expect(screen.getByRole('tab', { name: 'B' })).toHaveAttribute('data-state', 'active');
  });
});

/* ────────────────────────────────────────────────────────────────────────
 * cmdk / sonner / table (3g2).
 * ──────────────────────────────────────────────────────────────────────── */

describe('Command (cmdk)', () => {
  it('renders the command palette with input, list, and filtered items', async () => {
    const user = userEvent.setup();
    const Command = Primitives.Command;
    const CommandInput = Primitives.CommandInput;
    const CommandList = Primitives.CommandList;
    const CommandEmpty = Primitives.CommandEmpty;
    const CommandGroup = Primitives.CommandGroup;
    const CommandItem = Primitives.CommandItem;
    render(
      <Command>
        <CommandInput placeholder="Search…" />
        <CommandList>
          <CommandEmpty>No results</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem>New file</CommandItem>
            <CommandItem>Open folder</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>,
    );
    const input = screen.getByPlaceholderText('Search…');
    expect(input).toHaveAttribute('data-slot', 'command-input');
    expect(screen.getByText('New file')).toHaveAttribute('data-slot', 'command-item');
    await user.type(input, 'new');
    // Filtered: "New file" remains; "Open folder" gets hidden by cmdk
    expect(screen.getByText('New file')).toBeVisible();
  });
});

describe('Table', () => {
  it('renders semantic HTML table elements with data-slots', () => {
    const Table = Primitives.Table;
    const TableHeader = Primitives.TableHeader;
    const TableRow = Primitives.TableRow;
    const TableHead = Primitives.TableHead;
    const TableBody = Primitives.TableBody;
    const TableCell = Primitives.TableCell;
    const TableCaption = Primitives.TableCaption;
    const { container } = render(
      <Table>
        <TableCaption>Users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Alice</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(container.querySelector('table')).toHaveAttribute('data-slot', 'table');
    expect(container.querySelector('thead')).toHaveAttribute('data-slot', 'table-header');
    expect(container.querySelector('tbody')).toHaveAttribute('data-slot', 'table-body');
    expect(container.querySelector('caption')).toHaveAttribute('data-slot', 'table-caption');
    expect(screen.getByText('Alice').tagName).toBe('TD');
  });
});

/* ────────────────────────────────────────────────────────────────────────
 * Form / Calendar / InputOTP (3e).
 * ──────────────────────────────────────────────────────────────────────── */

describe('Calendar', () => {
  it('renders the month grid with day buttons', () => {
    const Calendar = Primitives.Calendar;
    const { container } = render(<Calendar />);
    // Root has the calendar data-slot
    expect(container.querySelector('[data-slot="calendar"]')).toBeTruthy();
    // react-day-picker + our CalendarDayButton stamps `data-day` on every
    // day cell with the locale date string — use that as the render hook.
    const dayCells = container.querySelectorAll('[data-day]');
    expect(dayCells.length).toBeGreaterThan(0);
  });
});

describe('InputOTP', () => {
  it('renders individual slots with data-slot hooks', () => {
    const InputOTP = Primitives.InputOTP;
    const InputOTPGroup = Primitives.InputOTPGroup;
    const InputOTPSlot = Primitives.InputOTPSlot;
    const { container } = render(
      <InputOTP maxLength={6}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
        </InputOTPGroup>
      </InputOTP>,
    );
    expect(container.querySelector('[data-slot="input-otp"]')).toBeTruthy();
    expect(container.querySelector('[data-slot="input-otp-group"]')).toBeTruthy();
    const slots = container.querySelectorAll('[data-slot="input-otp-slot"]');
    expect(slots.length).toBe(2);
  });
});

describe('Form (react-hook-form)', () => {
  it('renders a form field with label, control, description, and message', async () => {
    const { useForm } = await import('react-hook-form');
    const Form = Primitives.Form;
    const FormField = Primitives.FormField;
    const FormItem = Primitives.FormItem;
    const FormLabel = Primitives.FormLabel;
    const FormControl = Primitives.FormControl;
    const FormDescription = Primitives.FormDescription;

    function TestForm() {
      const form = useForm({ defaultValues: { email: '' } });
      return (
        <Form {...form}>
          <form>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <input {...field} placeholder="you@site.com" />
                  </FormControl>
                  <FormDescription>We never share your email.</FormDescription>
                </FormItem>
              )}
            />
          </form>
        </Form>
      );
    }

    render(<TestForm />);
    expect(screen.getByText('Email')).toHaveAttribute('data-slot', 'form-label');
    expect(screen.getByText('We never share your email.')).toHaveAttribute(
      'data-slot',
      'form-description',
    );
    expect(screen.getByPlaceholderText('you@site.com')).toBeInTheDocument();
  });
});

/* ────────────────────────────────────────────────────────────────────────
 * Heavy data primitives (3g3): Carousel, Chart, Resizable.
 * ──────────────────────────────────────────────────────────────────────── */

describe('Carousel', () => {
  it('renders a carousel with content and item data-slots', () => {
    const Carousel = Primitives.Carousel;
    const CarouselContent = Primitives.CarouselContent;
    const CarouselItem = Primitives.CarouselItem;
    const { container } = render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
        </CarouselContent>
      </Carousel>,
    );
    expect(container.querySelector('[data-slot="carousel"]')).toBeTruthy();
    expect(container.querySelector('[data-slot="carousel-content"]')).toBeTruthy();
    const items = container.querySelectorAll('[data-slot="carousel-item"]');
    expect(items.length).toBe(2);
    expect(items[0]).toHaveTextContent('Slide 1');
  });
});

describe('ChartContainer', () => {
  it('mounts a chart container with chart-id + data-chart attributes', () => {
    const ChartContainer = Primitives.ChartContainer;
    const { container } = render(
      <ChartContainer config={{ visitors: { label: 'Visitors', color: 'var(--chart-1)' } }}>
        <div>chart slot</div>
      </ChartContainer>,
    );
    const root = container.querySelector('[data-slot="chart"]') as HTMLElement;
    expect(root).toBeTruthy();
    expect(root.getAttribute('data-chart')).toMatch(/^chart-/);
  });
});

describe('Resizable', () => {
  it('renders a panel group with handles and data-slot attributes', () => {
    const ResizablePanelGroup = Primitives.ResizablePanelGroup;
    const ResizablePanel = Primitives.ResizablePanel;
    const ResizableHandle = Primitives.ResizableHandle;
    const { container } = render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50}>left</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>right</ResizablePanel>
      </ResizablePanelGroup>,
    );
    expect(container.querySelector('[data-slot="resizable-panel-group"]')).toBeTruthy();
    expect(container.querySelectorAll('[data-slot="resizable-panel"]').length).toBe(2);
    expect(container.querySelector('[data-slot="resizable-handle"]')).toBeTruthy();
  });
});

describe('Toaster (sonner)', () => {
  it('renders an ol container when mounted', () => {
    const Toaster = Primitives.Toaster;
    const { container } = render(<Toaster />);
    // sonner mounts a `<section>` + `<ol>` at the end of body via portal.
    // Even without dispatching a toast, the section is present for a11y.
    expect(
      container.ownerDocument.querySelector('section[aria-label*="otifications" i]'),
    ).toBeTruthy();
  });
});
