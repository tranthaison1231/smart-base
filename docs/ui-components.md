# UI components

Primitive UI dùng chung nằm ở `apps/web/src/_shared/ui`. Dùng lại các component này trước khi viết markup tương tự trong page hoặc feature.

## Thành phần hiện có

`Avatar`, `Badge`, `Button`, `Calendar`, `Card`, `ChartContainer`/`ChartConfig`, `Dialog`, `DropdownMenu`, `Field`, `Input`, `Label`, `Popover`, `Separator`, `Sheet`, `Sidebar`, `Skeleton`, `Toaster`, `Spinner`, `Table`, `ThemeProvider`, `Toggle`, `ToggleGroup`, `Tooltip`.

Import trực tiếp từ module để giữ API rõ ràng:

```tsx
import { Button } from "@/_shared/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/_shared/ui/table"

export function Example() {
  return (
    <>
      <Button type="button">Lưu</Button>
      <Table>
        <TableHeader><TableRow><TableHead>Tên</TableHead></TableRow></TableHeader>
        <TableBody><TableRow><TableCell>Sản phẩm</TableCell></TableRow></TableBody>
      </Table>
    </>
  )
}
```

Dialog có thể dùng các primitive được export từ cùng module:

```tsx
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/_shared/ui/dialog"
```

`RootLayout` đã mount `ThemeProvider`, `TooltipProvider` và `Toaster`. Không mount thêm một bản khác trong từng page. Theme token CSS nằm trong `apps/web/src/app/globals.css`; dùng token ngữ nghĩa thay vì hardcode màu khi tạo component mới. `cn` (`@/_shared/lib/cn`) gộp class Tailwind; `useIsMobile` nằm trong `@/_shared/lib/hooks/use-mobile`.

Các wrapper theo phong cách shadcn/Base UI đã có test tương tác cơ bản cho button, dialog và table. Component mới cần giữ keyboard interaction, accessible name và state disabled/loading khi phù hợp; mở rộng test theo hành vi đó.

