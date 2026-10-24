# UI components

Shared UI primitives live in `apps/web/src/_shared/ui`. Reuse these components before writing similar markup in a page or feature.

## Available components

`Avatar`, `Badge`, `Button`, `Calendar`, `Card`, `ChartContainer`, `ChartLegend`, `ChartLegendContent`, `ChartTooltip`, `ChartTooltipContent`, `Dialog`, `DropdownMenu`, `Field`, `Input`, `Label`, `Popover`, `Separator`, `Sheet`, `Sidebar`, `Skeleton`, `Toaster`, `Spinner`, `Table`, `ThemeProvider`, `Toggle`, `ToggleGroup`, and `Tooltip`.

The chart module also exports the `ChartConfig` type for defining chart series.

Import components directly from their modules to keep their APIs explicit:

```tsx
import { Button } from "@/_shared/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/_shared/ui/table"

export function Example() {
  return (
    <>
      <Button type="button">Save</Button>
      <Table>
        <TableHeader><TableRow><TableHead>Name</TableHead></TableRow></TableHeader>
        <TableBody><TableRow><TableCell>Product</TableCell></TableRow></TableBody>
      </Table>
    </>
  )
}
```

Dialogs can use the primitives exported from the same module:

```tsx
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/_shared/ui/dialog"
```

`RootLayout` already mounts `ThemeProvider`, `TooltipProvider`, and `Toaster`. Do not mount another instance in individual pages. CSS theme tokens live in `apps/web/src/app/globals.css`; use semantic tokens instead of hardcoded colors when creating components. `cn` (`@/_shared/lib/cn`) combines Tailwind classes; `useIsMobile` lives in `@/_shared/lib/hooks/use-mobile`.

These wrappers follow shadcn component patterns and use Base UI primitives. Basic interaction tests cover buttons, dialogs, and tables. New components should preserve keyboard interactions, accessible names, and disabled and loading states where appropriate; extend tests to cover that behavior.

