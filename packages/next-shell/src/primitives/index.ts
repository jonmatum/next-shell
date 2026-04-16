/**
 * shadcn/ui primitives — vendored from shadcn-ui/ui@84d1d476 and retheme
 * to the next-shell semantic-token system.
 *
 * Subpath: `@jonmatum/next-shell/primitives`
 *
 * This barrel is wrapped in a `'use client'` directive by the tsup post-build
 * hook (see `CLIENT_ENTRIES` in tsup.config.ts) because every Radix-backed
 * primitive is a client component.
 */

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion.js';
export { Alert, AlertDescription, AlertTitle } from './alert.js';
export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog.js';
export { AspectRatio } from './aspect-ratio.js';
export {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from './avatar.js';
export { Badge, badgeVariants } from './badge.js';
export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb.js';
export { Button, buttonVariants } from './button.js';
export { Calendar, CalendarDayButton } from './calendar.js';
export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card.js';
export { Checkbox } from './checkbox.js';
export { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible.js';
export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './command.js';
export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from './context-menu.js';
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from './dialog.js';
export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from './drawer.js';
export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './dropdown-menu.js';
export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from './form.js';
export { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card.js';
export { Input } from './input.js';
export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from './input-otp.js';
export { Label } from './label.js';
export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './pagination.js';
export { Progress } from './progress.js';
export {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from './menubar.js';
export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from './navigation-menu.js';
export {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from './popover.js';
export { RadioGroup, RadioGroupItem } from './radio-group.js';
export { ScrollArea, ScrollBar } from './scroll-area.js';
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select.js';
export { Separator } from './separator.js';
export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet.js';
export { Skeleton } from './skeleton.js';
export { Slider } from './slider.js';
export { Switch } from './switch.js';
export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './table.js';
export { Tabs, TabsContent, TabsList, TabsTrigger, tabsListVariants } from './tabs.js';
export { Textarea } from './textarea.js';
export { Toaster } from './sonner.js';
export { Toggle, toggleVariants } from './toggle.js';
export { ToggleGroup, ToggleGroupItem } from './toggle-group.js';
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip.js';
