import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as Primitives from '../src/primitives/index.js';
import {
  Button,
  Checkbox,
  Dialog,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuTrigger,
  Input,
  Label,
  Popover,
  PopoverTrigger,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectTrigger,
  SelectValue,
  Separator,
  Skeleton,
  Slider,
  Switch,
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
  ] as const;

  it.each(expected)('exports %s as a callable', (name) => {
    const value = (Primitives as Record<string, unknown>)[name];
    expect(value, `Primitives.${name} should be defined`).toBeDefined();
    expect(typeof value).toBe('function');
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
